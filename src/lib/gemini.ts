import { TrainingFormData, GeminiResponse } from '@/types/training';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export async function generateTrainingContent(formData: TrainingFormData): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const slidePrompt = createSlidePrompt(formData);

  try {
    // Generate slide content first
    const slidesResponse = await callGeminiAPI(slidePrompt, apiKey);
    const slidesContent = extractContent(slidesResponse);

    // Generate instructor guide based on the slides content
    const enhancedGuidePrompt = createEnhancedGuidePrompt(formData, slidesContent);
    const guideResponse = await callGeminiAPI(enhancedGuidePrompt, apiKey);
    const instructorGuideContent = extractContent(guideResponse);

    return {
      slidesContent,
      instructorGuideContent
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API failed: ${error.message}`);
    }
    throw new Error('Failed to generate training content with Gemini API');
  }
}

async function callGeminiAPI(prompt: string, apiKey: string) {
  const requestBody: GeminiRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Gemini API request timed out after 60 seconds');
    }
    throw error;
  }
}

function extractContent(response: unknown): string {
  // Type guard for Gemini API response structure
  if (
    response && 
    typeof response === 'object' &&
    'candidates' in response &&
    Array.isArray((response as { candidates: unknown[] }).candidates) &&
    (response as { candidates: unknown[] }).candidates.length > 0
  ) {
    const candidates = (response as { candidates: unknown[] }).candidates;
    const firstCandidate = candidates[0];
    
    if (
      firstCandidate &&
      typeof firstCandidate === 'object' &&
      'content' in firstCandidate &&
      firstCandidate.content &&
      typeof firstCandidate.content === 'object' &&
      'parts' in firstCandidate.content &&
      Array.isArray((firstCandidate.content as { parts: unknown[] }).parts) &&
      (firstCandidate.content as { parts: unknown[] }).parts.length > 0
    ) {
      const parts = (firstCandidate.content as { parts: unknown[] }).parts;
      const firstPart = parts[0];
      
      if (firstPart && typeof firstPart === 'object' && 'text' in firstPart) {
        return (firstPart as { text: string }).text;
      }
    }
  }
  
  throw new Error('Invalid response format from Gemini API');
}

function createSlidePrompt(formData: TrainingFormData): string {
  const { topic, level, duration, industry } = formData;
  
  return `Create a comprehensive ${duration}-minute training presentation on ${topic} for ${level} level students in the ${industry} industry.

IMPORTANT FORMATTING REQUIREMENTS:
- Use "---" to separate each slide
- Include slide titles as "# Title"
- Include bullet points and content for each slide
- Add speaker notes after each slide marked with "SPEAKER NOTES:"
- Suggest relevant images with "IMAGE SUGGESTION:"

CONTENT REQUIREMENTS:
- Opening slide with topic introduction
- Learning objectives (3-5 specific goals)
- Core concepts broken into digestible sections
- Real-world examples from ${industry} industry
- Interactive elements (discussions, activities)
- Practice exercises or case studies
- Summary and next steps
- Q&A slide

AUDIENCE LEVEL: ${level}
- Beginner: Basic concepts, lots of examples, step-by-step approach
- Intermediate: Build on existing knowledge, practical applications
- Advanced: Advanced techniques, leadership aspects, implementation challenges

INDUSTRY CONTEXT: ${industry}
- Include industry-specific examples
- Address common challenges in this sector
- Use relevant terminology and scenarios

DURATION: ${duration} minutes
- Allocate time appropriately across slides
- Include timing suggestions in speaker notes

Please generate the complete slide deck content now.`;
}


function createEnhancedGuidePrompt(formData: TrainingFormData, slidesContent: string): string {
  return `Based on the following slide deck content, create a detailed instructor's guide for this specific presentation:

SLIDE DECK CONTENT:
${slidesContent}

Create a comprehensive instructor's guide that includes:

1. **Session Overview**
   - Learning objectives that match the slides
   - Duration: ${formData.duration} minutes
   - Target audience: ${formData.level} level in ${formData.industry}

2. **Slide-by-Slide Instructions**
   - For each slide in the deck above, provide:
   - Detailed talking points
   - Timing recommendations
   - Key messages to emphasize
   - Potential questions from audience

3. **Interactive Elements**
   - Discussion questions that relate to slide content
   - Activities that reinforce key concepts
   - Industry-specific examples from ${formData.industry}

4. **Preparation and Materials**
   - What the instructor needs to prepare
   - Handouts or materials referenced in slides
   - Room setup recommendations

5. **Assessment and Engagement**
   - Knowledge check questions
   - Ways to keep audience engaged
   - How to handle different learning styles

6. **Troubleshooting**
   - Common questions about ${formData.topic}
   - Difficult concepts and how to explain them
   - Alternative explanations for complex topics

Please create the instructor's guide that specifically supports the slide deck content above.`;
}