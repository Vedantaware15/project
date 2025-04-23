import React from 'react';
import { Network } from 'lucide-react';

export function KnowledgeGraph() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Graph</h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore connections between papers, authors, and research topics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search papers, authors, or topics..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Graph Visualization Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px]">
          <div className="flex flex-col items-center justify-center h-full">
            {/* This is where you would integrate your actual graph visualization */}
            <div className="text-center">
              <Network className="h-16 w-16 text-indigo-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Interactive Knowledge Graph
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Visualize and explore relationships between papers, authors, and research topics.
                Click on nodes to discover connections.
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600">Papers</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Authors</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
            <span className="text-sm text-gray-600">Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
}