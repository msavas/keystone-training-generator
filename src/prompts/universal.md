# Universal Lean Training Prompt

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

Every concept should reinforce **lean thinking** and methodology, with {{topic}} as a powerful tool within the broader lean transformation journey.