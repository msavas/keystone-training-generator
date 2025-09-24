import { GammaApiRequest, GammaApiResponse } from '@/types/training';

const GAMMA_API_URL = 'https://public-api.gamma.app/v0.2/generations';

export async function generatePresentation(content: string): Promise<GammaApiResponse> {
  return generateGammaContent({
    content,
    type: 'presentation'
  });
}

export async function generateDocument(content: string): Promise<GammaApiResponse> {
  return generateGammaContent({
    content,
    type: 'document'
  });
}

async function generateGammaContent(request: GammaApiRequest): Promise<GammaApiResponse> {
  const apiKey = process.env.GAMMA_API_KEY;
  if (!apiKey) {
    throw new Error('Gamma API key not configured');
  }

  console.log('Gamma API request:', {
    type: request.type,
    contentLength: request.content?.length || 0,
    hasApiKey: !!apiKey
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout for design generation

  try {
    const response = await fetch(GAMMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({
        textOptions: {
          language: 'en'
        },
        inputText: request.content,
        type: request.type,
        // Add theme if provided
        ...(request.theme && { theme: request.theme })
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gamma API error details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`Gamma API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    
    // Extract the URL from Gamma's response format
    // Note: The exact response format may need adjustment based on actual API response
    if (result.url || result.shareUrl || result.link) {
      return {
        success: true,
        url: result.url || result.shareUrl || result.link
      };
    }

    // If the generation is still processing, we might get a different response
    if (result.id || result.generationId) {
      // In a real implementation, we might need to poll for completion
      // For now, we'll return the processing response
      return {
        success: false,
        error: 'Generation in progress - please check status'
      };
    }

    throw new Error('Unexpected response format from Gamma API');

  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Gamma API error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'Gamma API request timed out after 90 seconds'
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Utility function to format content for Gamma API
export function formatContentForGamma(content: string, type: 'presentation' | 'document'): string {
  if (type === 'presentation') {
    // For presentations, ensure proper slide breaks
    return content.replace(/---+/g, '---').trim();
  } else {
    // For documents, ensure proper formatting
    return content.trim();
  }
}

// Utility function to check if content is suitable for Gamma
export function validateGammaContent(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Content is empty' };
  }

  if (content.length > 50000) { // Assuming 50k character limit
    return { valid: false, error: 'Content exceeds maximum length' };
  }

  // Check for basic structure
  if (content.includes('---')) {
    // Presentation format - check for slides
    const slides = content.split('---').filter(slide => slide.trim().length > 0);
    if (slides.length === 0) {
      return { valid: false, error: 'No valid slides found' };
    }
  }

  return { valid: true };
}