import { TrainingFormData } from '@/types/training';

/**
 * Get the embedded universal template (avoids filesystem dependency in serverless)
 */
function getUniversalTemplate(): string {
  return `# Universal Lean Training Prompt

Create a comprehensive {{duration}}-minute **LEAN {{topic}}** training presentation for {{level}} level students in the {{industry}} industry.

**IMPORTANT: You must generate exactly {{total_slides}} slides total.** Use 5 minutes per slide as your guide.

## CONTENT DEPTH GUIDE
{{depth_instruction}}

## CORE LEAN METHODOLOGY FOCUS
This training MUST be grounded in **Lean Manufacturing/Lean Methodology** principles:
- Focus on **eliminating waste** and **maximizing customer value**
- Apply **continuous improvement (Kaizen)** mindset throughout
- Use **proven lean tools** and methodologies
- Connect all concepts to **operational excellence**
- Emphasize **respect for people** and **long-term thinking**

## LEAN PRINCIPLES INTEGRATION
Ensure the training incorporates these core lean principles:
- **Value** - Define value from customer perspective
- **Value Stream** - Map and optimize the entire process
- **Flow** - Create smooth, uninterrupted workflow
- **Pull** - Produce only what customers demand
- **Perfection** - Continuously improve toward perfection

## TOPIC-SPECIFIC LEAN FOCUS

{{#if_topic_5s}}
**5S WORKPLACE ORGANIZATION:**
- **5S as the foundation** of all lean initiatives
- Cover each S: **Seiri** (Sort), **Seiton** (Set in Order), **Seiso** (Shine), **Seiketsu** (Standardize), **Shitsuke** (Sustain)
- **Visual workplace** and **standardization** emphasis
- **Red tag strategy** and **shadow boards**
- **Discipline and sustaining** improvements focus
{{/if_topic_5s}}

{{#if_topic_waste-elimination}}
**WASTE ELIMINATION (MUDA):**
- **The 8 Wastes** with detailed explanations and {{industry}} examples:
  1. **Transportation** - Unnecessary movement of materials/products
  2. **Inventory** - Excess raw materials, WIP, or finished goods
  3. **Motion** - Unnecessary movement of people
  4. **Waiting** - Idle time when resources aren't being utilized
  5. **Overproduction** - Making more than customer demand
  6. **Over-processing** - Doing more work than customer values
  7. **Defects** - Errors, rework, scrap, corrections
  8. **Skills/Talent** - Underutilizing people's abilities
- **Root cause analysis** and **systematic elimination**
- **Value stream perspective** on waste identification
{{/if_topic_waste-elimination}}

{{#if_topic_value-stream-mapping}}
**VALUE STREAM MAPPING:**
- **Current state → Future state → Action plan** methodology
- **Material flow** and **information flow** mapping
- **Lead time analysis** and **process cycle efficiency**
- **Bottleneck identification** and **flow improvement**
- **Pull system integration** and **level loading**
{{/if_topic_value-stream-mapping}}

{{#if_topic_kaizen}}
**KAIZEN EVENTS:**
- **Continuous improvement** as everyone's responsibility
- **Kaizen event structure**: 3-5 day focused improvement workshops
- **PDCA cycle** (Plan-Do-Check-Act) integration
- **Gemba walks** and **problem-solving at the source**
- **Small incremental changes** creating big results
{{/if_topic_kaizen}}

{{#if_topic_pull-systems}}
**PULL SYSTEMS:**
- **Customer demand** drives all production activities
- **Kanban systems**: Production, withdrawal, supplier kanban
- **Just-In-Time** delivery and **inventory reduction**
- **FIFO lanes** and **continuous flow** concepts
- **Visual signals** and **pull vs. push** comparison
{{/if_topic_pull-systems}}

{{#if_topic_standardized-work}}
**STANDARDIZED WORK:**
- **Best practices** captured and consistently followed
- **Three elements**: Takt time, work sequence, standard in-process stock
- **Foundation for improvement** and problem identification
- **Visual standards** and **training integration**
- **Continuous improvement platform**
{{/if_topic_standardized-work}}

{{#if_topic_visual-management}}
**VISUAL MANAGEMENT:**
- **Make problems visible** for immediate response
- **Andon systems** and **status boards**
- **Visual controls** vs. **visual indicators**
- **5S integration** and **standardized signals**
- **Self-managing teams** through visual workplace
{{/if_topic_visual-management}}

{{#if_topic_poka-yoke}}
**POKA-YOKE (ERROR-PROOFING):**
- **Prevent defects** before they occur
- **Contact, fixed-value, and motion-step** detection methods
- **Warning vs. control** action methods
- **Human error** is inevitable, **systems prevent** mistakes
- **Zero defects** through mistake-proofing design
{{/if_topic_poka-yoke}}

## INDUSTRY-SPECIFIC LEAN APPLICATIONS ({{industry}})

{{#if_industry_food}}
**FOOD INDUSTRY LEAN FOCUS:**
- **Food safety integration** with lean practices
- **Waste reduction** in perishable inventory management
- **Flow optimization** in processing and packaging lines
- **Sanitary design** and **changeover efficiency**
- **Regulatory compliance** through standardization
- **HACCP** and **lean methodology** alignment
{{/if_industry_food}}

{{#if_industry_manufacturing}}
**MANUFACTURING LEAN FOCUS:**
- **Production flow** optimization and **setup reduction**
- **Quality at the source** (Jidoka) and **equipment effectiveness**
- **Supply chain** lean integration and **JIT delivery**
- **Multi-level kanban** systems and **mixed model** production
- **Maintenance integration** with daily operations
{{/if_industry_manufacturing}}

{{#if_industry_healthcare}}
**HEALTHCARE LEAN FOCUS:**
- **Patient flow** and **wait time** reduction
- **Medical error prevention** and **patient safety**
- **Resource utilization** optimization and **staff workflow**
- **Care standardization** and **evidence-based practices**
- **Regulatory compliance** and **quality metrics**
{{/if_industry_healthcare}}

{{#if_industry_automotive}}
**AUTOMOTIVE LEAN FOCUS:**
- **Just-in-Time** production and **Toyota Production System**
- **Quality control** and **defect prevention**
- **Supplier integration** and **lean supply chain**
- **Continuous flow** and **takt time** management
- **Kaizen culture** and **employee engagement**
{{/if_industry_automotive}}

## CONTENT STRUCTURE

### Opening ({{opening_slides}} slides - 10% of time)
- **Hook**: Compelling lean transformation story from {{industry}}
- **Problem Statement**: Current state challenges and waste impact
- **Lean Solution Overview**: How {{topic}} addresses these challenges
- **Learning Objectives**: Specific, measurable outcomes related to {{topic}}

### Core Content ({{core_slides}} slides - 70% of time)
- **{{topic}} Definition** within lean methodology context
- **Lean Tools and Techniques** specific to {{topic}}
- **{{industry}} Case Studies** and real-world examples
- **Hands-on Application** exercises and workshops
- **Implementation Roadmap** with clear, actionable steps

### Interactive Elements (integrated throughout core content)
- **Gemba Walk** concepts (going to see the actual place)
- **Problem-Solving Exercise** using lean thinking and {{topic}} tools
- **Value Stream Perspective** on {{topic}} application
- **Waste Identification** exercise related to {{topic}}

### Closing ({{closing_slides}} slides - 20% of time)
- **Key Takeaways** summarizing lean principles and {{topic}}
- **Action Planning** for immediate workplace implementation
- **Continuous Improvement** next steps and ongoing learning
- **Resources and Support** for sustained {{topic}} application

## AUDIENCE LEVEL CUSTOMIZATION

{{#if_level_beginner}}
**BEGINNER APPROACH:**
- Start with **basic lean history** and philosophy
- Use **simple, concrete examples** from {{industry}}
- Focus on **"what" and "why"** before **"how"**
- Provide **clear templates** and **step-by-step checklists**
- Emphasize **observation skills** and **waste awareness**
{{/if_level_beginner}}

{{#if_level_intermediate}}
**INTERMEDIATE APPROACH:**
- Assume **basic lean knowledge** and terminology
- Focus on **practical implementation** of {{topic}}
- Include **measurement systems** and **performance analysis**
- Discuss **common challenges** and **resistance management**
- Provide **advanced tools** and **integration techniques**
{{/if_level_intermediate}}

{{#if_level_advanced}}
**ADVANCED APPROACH:**
- Focus on **strategic lean transformation** through {{topic}}
- **Leadership role** in lean culture change and {{topic}} deployment
- **Advanced problem-solving** and **root cause analysis**
- **Sustaining and scaling** {{topic}} improvements
- **Integration** with other business systems and **strategic alignment**
{{/if_level_advanced}}

## FORMATTING REQUIREMENTS
- **CRITICAL: Create exactly {{total_slides}} slides - no more, no less**
- Use "---" to separate each slide
- Include slide titles as "# Title"
- Include bullet points and detailed content for each slide
- Add comprehensive speaker notes after each slide marked with "SPEAKER NOTES:"
- Suggest relevant images with "IMAGE SUGGESTION:"
- **Distribute slides as follows:**
  - Opening section: {{opening_slides}} slides
  - Core content section: {{core_slides}} slides  
  - Closing section: {{closing_slides}} slides

## SPEAKER NOTES REQUIREMENTS
For each slide, include detailed speaker notes with:
- **Key talking points** emphasizing lean principles and {{topic}}
- **{{industry}} examples** and success stories
- **Interactive questions** to engage participants
- **Timing guidance** for {{duration}}-minute session
- **Common misconceptions** and how to address them
- **Connection** to previous/next concepts and overall lean journey

## SUCCESS CRITERIA
This training should enable participants to:
- Understand how **{{topic}} fits within overall lean methodology**
- Apply **basic lean tools** related to {{topic}} in their workplace
- **Identify improvement opportunities** using {{topic}} principles
- Develop **action plans** using lean thinking and {{topic}} tools
- **Speak confidently** about lean principles and {{topic}} benefits
- **Lead improvement initiatives** using {{topic}} in their {{industry}} context

## LEAN CULTURE EMPHASIS
Remember: This is a **LEAN** training that should transform how participants think about:
- **Work** (value-added vs. waste)
- **Problems** (opportunities for improvement)
- **Processes** (continuous flow and customer value)
- **People** (respect, engagement, and continuous learning)
- **Improvement** (systematic, data-driven, and sustainable)

Every concept should reinforce **lean thinking** and methodology, with {{topic}} as a powerful tool within the broader lean transformation journey.`;
}

/**
 * Load a markdown prompt file and substitute variables
 */
export async function loadPrompt(topic: string, formData: TrainingFormData): Promise<string> {
  // Use embedded universal template instead of file system access
  const promptTemplate = getUniversalTemplate();
  
  // Substitute variables
  const processedPrompt = substituteVariables(promptTemplate, formData);
  
  return processedPrompt;
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