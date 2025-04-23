import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-xl font-bold text-indigo-600">Paper Analysis</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => navigate('/research-assistant')}
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Research Assistant
              </button>
              <button
                onClick={() => navigate('/knowledge-graph')}
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Knowledge Graph
              </button>
              {/* Add other navigation items as needed */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 