import React from 'react';
import { VisualInsights as VisualInsightsComponent } from '../components/visualizations/VisualInsights';
import { mockPapers, mockConnections, mockCitationTrends, mockTopAuthors, mockTopTopics } from '../services/mockData';

export function VisualInsights() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Visual Insights</h1>
        <p className="mt-2 text-lg text-gray-600">
          Explore research connections, citation networks, and knowledge graphs.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <VisualInsightsComponent
          papers={mockPapers}
          connections={mockConnections}
          citationTrends={mockCitationTrends}
          topAuthors={mockTopAuthors}
          topTopics={mockTopTopics}
        />
      </div>
    </div>
  );
} 