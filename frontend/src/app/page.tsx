'use client';

import { useEffect } from 'react';
import { useFeedback } from '@/hooks';
import FeedbackForm from '@/components/forms/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { LoadingSpinner } from '@/components/ui';

export default function Home() {
  const { loadFeedbacks, loading } = useFeedback();

  useEffect(() => {
    loadFeedbacks();
    console.log('helloooooooooooooo')
  }, [loadFeedbacks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading feedback board..." size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Feedback Board</h1>
          <p className="mt-2 text-gray-600">
            Submit and manage feedback items with status tracking through our simple workflow system.
          </p>
        </div>
        
        <div className="space-y-8">
          <FeedbackForm />
          <FeedbackList />
        </div>
      </div>
    </div>
  );
}