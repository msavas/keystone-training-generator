'use client';

import { useState, useEffect } from 'react';

interface ProgressStep {
  id: string;
  label: string;
  description: string;
}

interface ProgressIndicatorProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const GENERATION_STEPS: ProgressStep[] = [
  {
    id: 'content',
    label: 'Generating Content',
    description: 'AI is creating your customized training materials...'
  },
  {
    id: 'slides',
    label: 'Creating Slide Deck',
    description: 'Designing your professional presentation...'
  },
  {
    id: 'guide',
    label: 'Building Instructor Guide',
    description: 'Preparing your comprehensive teaching materials...'
  },
  {
    id: 'email',
    label: 'Sending Results',
    description: 'Delivering your training kit via email...'
  }
];

export function ProgressIndicator({ isVisible, onComplete }: ProgressIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    // TODO: Replace with real progress tracking via WebSocket or polling
    // Currently simulates progress - should be replaced with actual API progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1; // Increment by 1% every 800ms for more realistic timing
        
        // Update current step based on progress
        const stepProgress = newProgress / 100 * GENERATION_STEPS.length;
        const newStep = Math.min(Math.floor(stepProgress), GENERATION_STEPS.length - 1);
        setCurrentStep(newStep);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 800); // Slower, more realistic progress (80 seconds total)

    // Cleanup function to prevent memory leaks
    return () => {
      clearInterval(progressInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Generating Your Training Kit
        </h2>
        <p className="text-gray-600">
          This typically takes 1-2 minutes. Please don&apos;t close this window.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {GENERATION_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center p-4 rounded-lg border transition-all duration-300 ${
              index < currentStep
                ? 'bg-green-50 border-green-200'
                : index === currentStep
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Step Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
              index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}>
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : index === currentStep ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <h3 className={`font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </h3>
              <p className={`text-sm ${
                index <= currentStep ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {step.description}
              </p>
            </div>

            {/* Status */}
            {index < currentStep && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Complete
                </span>
              </div>
            )}
            {index === currentStep && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  In Progress
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Your training materials will be sent to your email and displayed below when ready.
        </div>
      </div>
    </div>
  );
}