import { TrainingFormData, GeminiResponse } from '@/types/training';
import { loadPrompt, createInstructorGuidePrompt } from '@/lib/prompts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

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

  const slidePrompt = await loadPrompt(formData.topic, formData);

  try {
    // Generate slide content first
    const slidesResponse = await callGeminiAPI(slidePrompt, apiKey);
    const slidesContent = extractContent(slidesResponse);

    // Generate instructor guide based on the slides content  
    const enhancedGuidePrompt = createInstructorGuidePrompt(formData, slidesContent);
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

// Old prompt functions removed - now using markdown-based prompt system