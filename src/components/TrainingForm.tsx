'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TrainingFormData,
  TRAINING_TOPICS,
  TRAINING_INDUSTRIES,
  DURATION_OPTIONS,
  STUDENT_LEVELS,
} from '@/types/training';

const formSchema = z.object({
  topic: z.string().min(1, 'Please select a topic'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Please select a student level',
  }),
  duration: z.number().min(30).max(240),
  industry: z.string().min(1, 'Please select an industry'),
  email: z.string().email('Please enter a valid email address'),
});

interface TrainingFormProps {
  onSubmit: (data: TrainingFormData) => void;
  isLoading: boolean;
  remainingGenerations?: number;
}

export function TrainingForm({ onSubmit, isLoading, remainingGenerations }: TrainingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TrainingFormData>({
    resolver: zodResolver(formSchema),
  });

  const handleLevelChange = (level: TrainingFormData['level']) => {
    setValue('level', level);
  };

  const isFormDisabled = isLoading || (remainingGenerations !== undefined && remainingGenerations <= 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Topic Selection */}
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
          Lean Topic *
        </label>
        <select
          {...register('topic')}
          disabled={isFormDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select a topic...</option>
          {TRAINING_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
        {errors.topic && (
          <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
        )}
      </div>

      {/* Student Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Student Level *
        </label>
        <div className="space-y-3">
          {STUDENT_LEVELS.map((level) => (
            <div key={level.value} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id={level.value}
                  value={level.value}
                  {...register('level')}
                  disabled={isFormDisabled}
                  onChange={() => handleLevelChange(level.value)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 disabled:cursor-not-allowed"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={level.value} className="text-sm font-medium text-gray-900 cursor-pointer">
                  {level.label}
                </label>
                <p className="text-sm text-gray-500">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
        {errors.level && (
          <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
        )}
      </div>

      {/* Training Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Training Duration *
        </label>
        <select
          {...register('duration', { valueAsNumber: true })}
          disabled={isFormDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select duration...</option>
          {DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
          Industry *
        </label>
        <select
          {...register('industry')}
          disabled={isFormDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select industry...</option>
          {TRAINING_INDUSTRIES.map((industry) => (
            <option key={industry.value} value={industry.value}>
              {industry.label}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          {...register('email')}
          disabled={isFormDisabled}
          placeholder="your.email@company.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          We&apos;ll send your training materials to this email address
        </p>
      </div>

      {/* Usage Information */}
      {remainingGenerations !== undefined && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Free Generations Remaining: {remainingGenerations}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                {remainingGenerations > 0 ? (
                  <p>You have {remainingGenerations} free training kit generations remaining.</p>
                ) : (
                  <p>You&apos;ve used all your free generations. <a href="#" className="font-medium underline">Upgrade to continue</a>.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isFormDisabled}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating Training Kit...
          </div>
        ) : (
          'Generate My Training Kit'
        )}
      </button>

      {remainingGenerations !== undefined && remainingGenerations <= 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Need more generations?</p>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            Upgrade to Pro
          </a>
        </div>
      )}
    </form>
  );
}