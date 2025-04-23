import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BarChart2, Network, MessageSquare } from 'lucide-react';

export function Features() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze papers for key findings, methodology, and insights.',
      icon: <Activity className="h-8 w-8 text-indigo-500" />,
      path: '/ai-analysis'
    },
    {
      title: 'Visual Insights',
      description: 'Interactive visualizations of research trends, citations, and relationships between papers.',
      icon: <BarChart2 className="h-8 w-8 text-indigo-500" />,
      path: '/visual-insights'
    },
    {
      title: 'Research Assistant Chat',
      description: 'Ask questions about papers and get intelligent responses based on the content.',
      icon: <MessageSquare className="h-8 w-8 text-indigo-500" />,
      path: '/chat'
    },
    {
      title: 'Knowledge Graph',
      description: 'Explore connections between papers, authors, and research topics.',
      icon: <Network className="h-8 w-8 text-indigo-500" />,
      path: '/knowledge-graph'
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Intelligent Paper Analysis
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Powerful tools to help you understand and analyze research papers
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                  <button
                    onClick={() => navigate(feature.path)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Try Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 