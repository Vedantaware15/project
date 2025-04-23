import React, { useState } from 'react';
import { ResponsiveNetwork } from '@nivo/network';

const connectedPapersData = {
  nodes: [
    { id: 'Main Paper', radius: 18 },
    { id: 'Cobo, 2011', radius: 12 },
    { id: 'Veron, 2021', radius: 10 },
    { id: 'Cobo, 2019', radius: 10 },
    { id: 'Mutahhar, 2012', radius: 11 },
    { id: 'Torres, 2010', radius: 9 }
  ],
  links: [
    { source: 'Main Paper', target: 'Cobo, 2011' },
    { source: 'Main Paper', target: 'Veron, 2021' },
    { source: 'Main Paper', target: 'Cobo, 2019' },
    { source: 'Main Paper', target: 'Mutahhar, 2012' },
    { source: 'Main Paper', target: 'Torres, 2010' },
    { source: 'Cobo, 2011', target: 'Cobo, 2019' }
  ]
};

const citationNetworkData = {
  nodes: [
    { id: 'DeepFruits', radius: 16 },
    { id: 'Sa, 2016', radius: 12 },
    { id: 'Kumar, 2019', radius: 10 },
    { id: 'Rahman, 2017', radius: 10 },
    { id: 'Liang, 2020', radius: 11 },
    { id: 'Baroti, 2015', radius: 9 }
  ],
  links: [
    { source: 'DeepFruits', target: 'Sa, 2016' },
    { source: 'DeepFruits', target: 'Kumar, 2019' },
    { source: 'DeepFruits', target: 'Rahman, 2017' },
    { source: 'DeepFruits', target: 'Liang, 2020' },
    { source: 'Rahman, 2017', target: 'Baroti, 2015' }
  ]
};

const knowledgeGraphData = {
  nodes: [
    { id: 'Conflict', radius: 16 },
    { id: 'Melander, 2005', radius: 13 },
    { id: 'Caprioli, 2007', radius: 11 },
    { id: 'Bjarnegard, 2011', radius: 10 },
    { id: 'Tessler, 1999', radius: 9 },
    { id: 'Gleditsch, 2003', radius: 10 }
  ],
  links: [
    { source: 'Conflict', target: 'Melander, 2005' },
    { source: 'Conflict', target: 'Caprioli, 2007' },
    { source: 'Conflict', target: 'Bjarnegard, 2011' },
    { source: 'Conflict', target: 'Tessler, 1999' },
    { source: 'Caprioli, 2007', target: 'Gleditsch, 2003' }
  ]
};

export function VisualInsights() {
  const [activeTab, setActiveTab] = useState('connected');

  const getData = () => {
    if (activeTab === 'connected') return connectedPapersData;
    if (activeTab === 'citation') return citationNetworkData;
    if (activeTab === 'knowledge') return knowledgeGraphData;
    return { nodes: [], links: [] };
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Visual Insights</h1>
          <p className="mt-2 text-lg text-gray-600">
            Interactive visualizations of research trends, citations, and relationships between papers.
          </p>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex justify-center space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('connected')}
              className={`$ {
                activeTab === 'connected'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Connected Papers
            </button>
            <button
              onClick={() => setActiveTab('citation')}
              className={`$ {
                activeTab === 'citation'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Citation Network
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`$ {
                activeTab === 'knowledge'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Knowledge Graph
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px]">
          <ResponsiveNetwork
            nodes={getData().nodes}
            links={getData().links}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            linkDistance={function (e) { return 100; }}
            centeringStrength={0.3}
            repulsivity={20}
            nodeSize={n => n.radius}
            activeNodeSize={n => n.radius + 4}
            nodeColor={{ from: 'id', modifiers: [] }}
            nodeBorderWidth={1}
            nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
            linkThickness={1.5}
            linkColor={{ theme: 'background' }}
            motionConfig="wobbly"
          />
        </div>
      </div>
    </div>
  );
}
