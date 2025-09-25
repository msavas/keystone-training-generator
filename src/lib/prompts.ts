import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { TrainingFormData } from '@/types/training';

const PROMPTS_DIR = join(process.cwd(), 'src', 'prompts');

/**
 * Load a markdown prompt file and substitute variables
 */
export async function loadPrompt(topic: string, formData: TrainingFormData): Promise<string> {
  const universalFilePath = join(PROMPTS_DIR, 'universal.md');
  
  // Check if universal prompt file exists
  if (!existsSync(universalFilePath)) {
    console.warn('Universal prompt file not found, using default');
    return createDefaultPrompt(formData);
  }

  try {
    // Read the universal markdown file
    const promptTemplate = readFileSync(universalFilePath, 'utf-8');
    
    // Substitute variables
    const processedPrompt = substituteVariables(promptTemplate, formData);
    
    return processedPrompt;
  } catch (error) {
    console.error(`Error loading universal prompt:`, error);
    return createDefaultPrompt(formData);
  }
}

/**
 * Substitute template variables in the prompt
 */
function substituteVariables(template: string, formData: TrainingFormData): string {
  const { topic, level, duration, industry } = formData;
  
  // Calculate slide counts based on 5 minutes per slide, minimum 15 slides
  const calculatedSlides = Math.round(duration / 5);
  const totalSlides = Math.max(15, calculatedSlides);
  const openingSlides = Math.max(1, Math.round(totalSlides * 0.10));
  const closingSlides = Math.max(1, Math.round(totalSlides * 0.20));
  const coreSlides = Math.max(1, totalSlides - openingSlides - closingSlides);
  
  // Determine content depth based on duration
  let depthInstruction = '';
  if (duration < 60) {
    depthInstruction = 'Focus on a high-level overview. The content should be concise, covering only the most critical points and key takeaways. Prioritize breadth over depth.';
  } else if (duration <= 120) {
    depthInstruction = 'Provide a balanced level of detail. Explain core concepts clearly and provide one or two illustrative examples for each key point.';
  } else {
    depthInstruction = 'This is a comprehensive training. Deliver in-depth content for each topic. Include detailed explanations, multiple examples, case studies, and practical application steps.';
  }
  
  let result = template;
  
  // Basic variable substitution
  result = result.replace(/\{\{duration\}\}/g, duration.toString());
  result = result.replace(/\{\{level\}\}/g, level);
  result = result.replace(/\{\{industry\}\}/g, industry);
  result = result.replace(/\{\{topic\}\}/g, getTopicLabel(topic));
  
  // Slide count substitutions
  result = result.replace(/\{\{total_slides\}\}/g, totalSlides.toString());
  result = result.replace(/\{\{opening_slides\}\}/g, openingSlides.toString());
  result = result.replace(/\{\{core_slides\}\}/g, coreSlides.toString());
  result = result.replace(/\{\{closing_slides\}\}/g, closingSlides.toString());
  result = result.replace(/\{\{depth_instruction\}\}/g, depthInstruction);
  
  // Conditional blocks - simple implementation
  result = processConditionals(result, {
    level,
    industry,
    topic
  });
  
  return result;
}

/**
 * Process conditional blocks like {{#if_industry_food}}...{{/if_industry_food}}
 */
function processConditionals(text: string, data: { level: string; industry: string; topic: string }): string {
  let result = text;
  
  // Industry conditionals
  const industryMatch = data.industry.toLowerCase();
  result = processConditionalBlock(result, 'if_industry_food', industryMatch.includes('food'));
  result = processConditionalBlock(result, 'if_industry_manufacturing', industryMatch.includes('manufacturing'));
  result = processConditionalBlock(result, 'if_industry_healthcare', industryMatch.includes('healthcare'));
  result = processConditionalBlock(result, 'if_industry_automotive', industryMatch.includes('automotive'));
  
  // Level conditionals  
  result = processConditionalBlock(result, 'if_level_beginner', data.level === 'beginner');
  result = processConditionalBlock(result, 'if_level_intermediate', data.level === 'intermediate');
  result = processConditionalBlock(result, 'if_level_advanced', data.level === 'advanced');
  
  // Topic conditionals
  result = processConditionalBlock(result, 'if_topic_5s', data.topic === '5s');
  result = processConditionalBlock(result, 'if_topic_value-stream-mapping', data.topic === 'value-stream-mapping');
  result = processConditionalBlock(result, 'if_topic_kaizen', data.topic === 'kaizen');
  result = processConditionalBlock(result, 'if_topic_pull-systems', data.topic === 'pull-systems');
  result = processConditionalBlock(result, 'if_topic_waste-elimination', data.topic === 'waste-elimination');
  result = processConditionalBlock(result, 'if_topic_standardized-work', data.topic === 'standardized-work');
  result = processConditionalBlock(result, 'if_topic_visual-management', data.topic === 'visual-management');
  result = processConditionalBlock(result, 'if_topic_poka-yoke', data.topic === 'poka-yoke');
  
  return result;
}

/**
 * Process a single conditional block
 */
function processConditionalBlock(text: string, condition: string, isTrue: boolean): string {
  const regex = new RegExp(`\\{\\{#${condition}\\}\\}([\\s\\S]*?)\\{\\{\\/${condition}\\}\\}`, 'g');
  
  return text.replace(regex, (match, content) => {
    return isTrue ? content : '';
  });
}

/**
 * Get the display label for a topic value
 */
function getTopicLabel(topicValue: string): string {
  const topicMap: Record<string, string> = {
    '5s': '5S Workplace Organization',
    'value-stream-mapping': 'Value Stream Mapping', 
    'kaizen': 'Kaizen Events',
    'pull-systems': 'Pull Systems',
    'waste-elimination': 'Waste Elimination',
    'standardized-work': 'Standardized Work',
    'visual-management': 'Visual Management',
    'setup-reduction': 'Setup Reduction (SMED)',
    'total-productive-maintenance': 'Total Productive Maintenance'
  };
  
  return topicMap[topicValue] || topicValue;
}

/**
 * Fallback default prompt if no specific markdown file exists
 */
function createDefaultPrompt(formData: TrainingFormData): string {
  const { topic, level, duration, industry } = formData;
  const topicLabel = getTopicLabel(topic);
  
  return `Create a comprehensive ${duration}-minute **LEAN ${topicLabel}** training presentation for ${level} level students in the ${industry} industry.

## CORE LEAN FOCUS
This training MUST be grounded in **Lean Manufacturing/Lean Methodology** principles:
- Focus on **eliminating waste** and **creating value**
- Apply **continuous improvement (Kaizen)** mindset
- Use **proven lean tools** and methodologies
- Connect to **customer value** and **operational excellence**
- Include **${industry}-specific examples** and applications

## CONTENT REQUIREMENTS:
- Opening slide with topic introduction and lean context
- Learning objectives (3-5 specific goals related to lean ${topicLabel})
- Core lean concepts and principles
- Practical application of lean tools
- Real-world examples from ${industry} industry  
- Interactive elements (discussions, exercises)
- Implementation guidance and next steps
- Q&A slide

## FORMATTING REQUIREMENTS:
- Use "---" to separate each slide
- Include slide titles as "# Title"
- Include bullet points and content for each slide
- Add speaker notes after each slide marked with "SPEAKER NOTES:"
- Suggest relevant images with "IMAGE SUGGESTION:"

## AUDIENCE LEVEL: ${level}
${level === 'beginner' ? '- Basic lean concepts, lots of examples, step-by-step approach' : ''}
${level === 'intermediate' ? '- Build on existing lean knowledge, practical applications' : ''}
${level === 'advanced' ? '- Advanced lean techniques, leadership aspects, implementation challenges' : ''}

Remember: This is a **LEAN** training focused on proven lean methodology and tools.`;
}

/**
 * Create enhanced instructor guide prompt (also supports markdown templates in the future)
 */
export function createInstructorGuidePrompt(formData: TrainingFormData, slidesContent: string): string {
  return `Based on the following slide deck content, create a detailed instructor's guide for this **LEAN** training presentation:

SLIDE DECK CONTENT:
${slidesContent}

Create a comprehensive instructor's guide that includes:

1. **Session Overview**
   - Learning objectives that match the slides
   - Duration: ${formData.duration} minutes
   - Target audience: ${formData.level} level in ${formData.industry}
   - **Key lean principles** covered in this session

2. **Slide-by-Slide Instructions**
   - For each slide in the deck above, provide:
   - Detailed talking points emphasizing **lean methodology**
   - Timing recommendations
   - Key **lean concepts** to emphasize
   - **${formData.industry}-specific examples** and stories
   - Potential questions from audience

3. **Interactive Elements**
   - Discussion questions that reinforce **lean thinking**
   - Hands-on activities using **lean tools**
   - Industry-specific examples from ${formData.industry}
   - **Gemba walk** or workplace observation exercises

4. **Preparation and Materials**
   - What the instructor needs to prepare
   - **Lean tools** and templates to have ready
   - Handouts or materials referenced in slides
   - Room setup recommendations for interactive elements

5. **Assessment and Engagement**
   - Knowledge check questions about **lean principles**
   - Ways to keep audience engaged with **lean thinking**
   - How to handle different learning styles
   - **Action planning** for lean implementation

6. **Troubleshooting**
   - Common questions about **lean methodology**
   - Difficult concepts and how to explain them using **lean terminology**
   - How to address resistance to **lean change**
   - Alternative explanations for complex lean topics

Remember: This guide supports a **LEAN** training focused on proven lean methodology, tools, and continuous improvement principles.`;
}