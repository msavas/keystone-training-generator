import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { generateTrainingContent } from '@/lib/gemini';
import { generatePresentation, generateDocument, formatContentForGamma, validateGammaContent } from '@/lib/gamma';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { TrainingFormData, GenerationResponse, TRAINING_TOPICS, TRAINING_INDUSTRIES } from '@/types/training';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_FREE_GENERATIONS = parseInt(process.env.MAX_FREE_GENERATIONS || '3');

// Server-side validation schema
const trainingFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).max(254),
  topic: z.string().min(2, "Topic must be at least 2 characters").max(100)
    .refine(val => TRAINING_TOPICS.some(t => t.value === val), "Invalid topic selected"),
  level: z.enum(['beginner', 'intermediate', 'advanced'], { 
    message: "Level must be beginner, intermediate, or advanced" 
  }),
  duration: z.number().int().min(30).max(240)
    .refine(val => val % 30 === 0, "Duration must be in 30-minute increments"),
  industry: z.string().min(2, "Industry must be at least 2 characters").max(50)
    .refine(val => TRAINING_INDUSTRIES.some(i => i.value === val), "Invalid industry selected"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Comprehensive server-side validation
    const validationResult = trainingFormSchema.safeParse(body.formData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const formData = validationResult.data;

    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `generate:${formData.email}:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    
    const rateLimitHeaders = getRateLimitHeaders(rateLimitKey);
    
    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime ? new Date(rateLimit.resetTime).toISOString() : undefined;
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          message: `Too many generation requests. Try again after ${resetTime ? new Date(rateLimit.resetTime!).toLocaleTimeString() : '15 minutes'}.`,
          retryAfter: rateLimit.resetTime
        },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      );
    }

    // Check user's remaining generations
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', formData.email)
      .single();

    let userId: string;
    let generationsUsed = 0;

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({ 
          email: formData.email, 
          generations_used: 0 
        })
        .select()
        .single();

      if (createError || !newUser) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { success: false, error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    } else if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    } else {
      userId = user.id;
      generationsUsed = user.generations_used;
    }

    // Check if user has exceeded free limit
    if (generationsUsed >= MAX_FREE_GENERATIONS) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Free generation limit exceeded',
          message: `You have used all ${MAX_FREE_GENERATIONS} free generations. Please upgrade to continue.`
        },
        { status: 403 }
      );
    }

    // Create generation record
    const { data: generation, error: generationError } = await supabaseAdmin
      .from('generations')
      .insert({
        user_id: userId,
        topic: formData.topic,
        level: formData.level,
        duration: formData.duration,
        industry: formData.industry,
        status: 'processing'
      })
      .select()
      .single();

    if (generationError || !generation) {
      console.error('Error creating generation:', generationError);
      return NextResponse.json(
        { success: false, error: 'Failed to start generation' },
        { status: 500 }
      );
    }

    try {
      // Step 1: Generate content with Gemini
      const geminiResponse = await generateTrainingContent(formData);

      // Step 2: Validate content for Gamma
      const slideValidation = validateGammaContent(geminiResponse.slidesContent);
      if (!slideValidation.valid) {
        throw new Error(`Invalid slide content: ${slideValidation.error}`);
      }

      const guideValidation = validateGammaContent(geminiResponse.instructorGuideContent);
      if (!guideValidation.valid) {
        throw new Error(`Invalid guide content: ${guideValidation.error}`);
      }

      // Step 3: Generate presentation and document with Gamma
      const [slideDeckResponse, instructorGuideResponse] = await Promise.all([
        generatePresentation(formatContentForGamma(geminiResponse.slidesContent, 'presentation')),
        generateDocument(formatContentForGamma(geminiResponse.instructorGuideContent, 'document'))
      ]);

      if (!slideDeckResponse.success || !instructorGuideResponse.success) {
        throw new Error('Failed to generate documents with Gamma API');
      }

      // Step 4: Update generation with URLs
      const { error: updateError } = await supabaseAdmin
        .from('generations')
        .update({
          status: 'completed',
          slide_deck_url: slideDeckResponse.url,
          instructor_guide_url: instructorGuideResponse.url,
          updated_at: new Date().toISOString()
        })
        .eq('id', generation.id);

      if (updateError) {
        console.error('Error updating generation:', updateError);
      }

      // Step 5: Increment user's generation count
      const { error: incrementError } = await supabaseAdmin
        .from('users')
        .update({ 
          generations_used: generationsUsed + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (incrementError) {
        console.error('Error incrementing generation count:', incrementError);
      }

      // Step 6: Send email notification
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Keystone Kaizen <noreply@keystonekaizen.com>',
          to: formData.email,
          subject: `Your ${formData.topic} Training Kit is Ready!`,
          html: createEmailTemplate(formData, slideDeckResponse.url!, instructorGuideResponse.url!)
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Don't fail the entire request if email fails
      }

      const response: GenerationResponse = {
        success: true,
        slideDeckUrl: slideDeckResponse.url,
        instructorGuideUrl: instructorGuideResponse.url,
        generationId: generation.id,
        message: 'Training kit generated successfully!'
      };

      return NextResponse.json(response, {
        headers: rateLimitHeaders
      });

    } catch (error) {
      // Update generation status to failed
      await supabaseAdmin
        .from('generations')
        .update({ status: 'failed' })
        .eq('id', generation.id);

      console.error('Generation error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Generation failed'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createEmailTemplate(formData: TrainingFormData, slideDeckUrl: string, instructorGuideUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Your Training Kit is Ready! 🎉</h2>
      
      <p>Hi there!</p>
      
      <p>Your custom <strong>${formData.topic}</strong> training materials have been generated and are ready for use.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Training Details:</h3>
        <ul>
          <li><strong>Topic:</strong> ${formData.topic}</li>
          <li><strong>Level:</strong> ${formData.level}</li>
          <li><strong>Duration:</strong> ${formData.duration} minutes</li>
          <li><strong>Industry:</strong> ${formData.industry}</li>
        </ul>
      </div>
      
      <div style="margin: 30px 0;">
        <h3>Your Training Materials:</h3>
        <p style="margin: 10px 0;">
          <a href="${slideDeckUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px;">
            📊 View Slide Deck
          </a>
        </p>
        <p style="margin: 10px 0;">
          <a href="${instructorGuideUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            📋 Download Instructor's Guide
          </a>
        </p>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">
          These links will remain active for 30 days. We recommend downloading your materials for permanent access.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Questions? Contact us at support@keystonekaizen.com
        </p>
      </div>
    </div>
  `;
}