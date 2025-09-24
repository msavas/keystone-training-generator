import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';

const MAX_FREE_GENERATIONS = parseInt(process.env.MAX_FREE_GENERATIONS || '3');

// Validation schema for email parameter
const emailSchema = z.string().email({ message: "Invalid email address" }).max(254);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting check for usage endpoint
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `usage:${email}:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    
    const rateLimitHeaders = getRateLimitHeaders(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many usage check requests. Please try again later.'
        },
        { 
          status: 429,
          headers: rateLimitHeaders
        }
      );
    }

    // Get user's usage information
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('generations_used')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user usage:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { 
          status: 500,
          headers: rateLimitHeaders
        }
      );
    }

    const generationsUsed = user?.generations_used || 0;
    const remainingGenerations = Math.max(0, MAX_FREE_GENERATIONS - generationsUsed);

    return NextResponse.json({
      generationsUsed,
      maxGenerations: MAX_FREE_GENERATIONS,
      remainingGenerations,
      hasExceededLimit: generationsUsed >= MAX_FREE_GENERATIONS
    }, {
      headers: rateLimitHeaders
    });

  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}