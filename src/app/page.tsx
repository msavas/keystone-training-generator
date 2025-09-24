'use client';

import { useState, useEffect } from 'react';
import { TrainingForm } from '@/components/TrainingForm';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { TrainingFormData, GenerationResponse } from '@/types/training';

type AppState = 'form' | 'generating' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('form');
  const [generationResult, setGenerationResult] = useState<GenerationResponse | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Check usage when email changes
    if (userEmail && appState === 'form') {
      checkUsage(userEmail);
    }
  }, [userEmail, appState]);

  const checkUsage = async (email: string) => {
    try {
      const response = await fetch(`/api/usage?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setRemainingGenerations(data.remainingGenerations);
      }
    } catch (error) {
      console.error('Error checking usage:', error);
    }
  };

  const handleFormSubmit = async (formData: TrainingFormData) => {
    setUserEmail(formData.email);
    setAppState('generating');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      const result: GenerationResponse = await response.json();
      setGenerationResult(result);

      // Update remaining generations
      if (result.success) {
        setRemainingGenerations(prev => prev !== undefined ? Math.max(0, prev - 1) : undefined);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationResult({
        success: false,
        error: 'Network error. Please check your connection and try again.'
      });
    }
  };

  const handleGenerationComplete = () => {
    setAppState('results');
  };

  const handleStartNew = () => {
    setAppState('form');
    setGenerationResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Keystone Kaizen Training Generator
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Generate professional lean training materials in minutes
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {appState === 'form' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Your Training Kit
              </h2>
              <p className="text-gray-600">
                Fill out the form below to generate a customized training presentation and instructor&apos;s guide.
              </p>
            </div>
            
            <TrainingForm
              onSubmit={handleFormSubmit}
              isLoading={false}
              remainingGenerations={remainingGenerations}
            />
          </div>
        )}

        {appState === 'generating' && (
          <ProgressIndicator
            isVisible={true}
            onComplete={handleGenerationComplete}
          />
        )}

        {appState === 'results' && generationResult && (
          <ResultsDisplay
            result={generationResult}
            onStartNew={handleStartNew}
            remainingGenerations={remainingGenerations}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              Powered by AI • Built by <a href="https://keystonekaizen.com" className="text-blue-600 hover:text-blue-800">Keystone Kaizen</a>
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
