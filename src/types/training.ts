export interface TrainingFormData {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in 30-minute increments (30, 60, 90, 120, 150, 180, 210, 240)
  industry: string;
  email: string;
}

export interface TrainingTopics {
  value: string;
  label: string;
  description: string;
}

export interface TrainingIndustries {
  value: string;
  label: string;
}

export interface GenerationRequest {
  formData: TrainingFormData;
  userId: string;
}

export interface GenerationResponse {
  success: boolean;
  slideDeckUrl?: string;
  instructorGuideUrl?: string;
  generationId?: string;
  message?: string;
  error?: string;
}

export interface UserUsage {
  id: string;
  email: string;
  generationsUsed: number;
  maxGenerations: number;
  createdAt: string;
  updatedAt: string;
}

export interface Generation {
  id: string;
  userId: string;
  topic: string;
  level: string;
  duration: number;
  industry: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  slideDeckUrl?: string;
  instructorGuideUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GammaApiRequest {
  content: string;
  theme?: string;
  type: 'presentation' | 'document';
}

export interface GammaApiResponse {
  success: boolean;
  url?: string;
  error?: string;
  generationId?: string;
}

export interface GeminiResponse {
  slidesContent: string;
  instructorGuideContent: string;
}

export const TRAINING_TOPICS: TrainingTopics[] = [
  {
    value: '5s',
    label: '5S Workplace Organization',
    description: 'Sort, Set in Order, Shine, Standardize, Sustain'
  },
  {
    value: 'value-stream-mapping',
    label: 'Value Stream Mapping',
    description: 'Visual mapping of material and information flow'
  },
  {
    value: 'kaizen',
    label: 'Kaizen Events',
    description: 'Continuous improvement methodology and events'
  },
  {
    value: 'pull-systems',
    label: 'Pull Systems',
    description: 'Kanban and pull-based production systems'
  },
  {
    value: 'waste-elimination',
    label: 'Waste Elimination',
    description: 'Identifying and eliminating the 8 wastes'
  },
  {
    value: 'standardized-work',
    label: 'Standardized Work',
    description: 'Creating and maintaining work standards'
  },
  {
    value: 'visual-management',
    label: 'Visual Management',
    description: 'Visual controls and management systems'
  },
  {
    value: 'poka-yoke',
    label: 'Poka-Yoke',
    description: 'Error-proofing and mistake prevention'
  }
];

export const TRAINING_INDUSTRIES: TrainingIndustries[] = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'software', label: 'Software/Technology' },
  { value: 'logistics', label: 'Logistics/Supply Chain' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
  { value: 'retail', label: 'Retail' },
  { value: 'construction', label: 'Construction' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'education', label: 'Education' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' }
];

export const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 150, label: '2.5 hours' },
  { value: 180, label: '3 hours' },
  { value: 210, label: '3.5 hours' },
  { value: 240, label: '4 hours' }
];

export const STUDENT_LEVELS = [
  {
    value: 'beginner' as const,
    label: 'Beginner',
    description: 'Little to no experience with lean principles'
  },
  {
    value: 'intermediate' as const,
    label: 'Intermediate',
    description: 'Some familiarity with lean concepts and tools'
  },
  {
    value: 'advanced' as const,
    label: 'Advanced',
    description: 'Experienced with lean implementation and leadership'
  }
];