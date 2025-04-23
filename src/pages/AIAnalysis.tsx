import React from 'react';
import { Chat } from './Chat';

export function AIAnalysis() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Analysis</h1>
            <p className="mt-2 text-lg text-gray-600">
              Advanced machine learning algorithms analyze papers for key findings, methodology, and insights.
            </p>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
} 