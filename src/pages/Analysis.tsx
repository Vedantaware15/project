import React from 'react';
import { FileText, BookOpen, Users, Tag, Brain, Search, FileSearch, BookMarked, Sparkles as FileSparkles, Network, GitFork, Layers } from 'lucide-react';

export function Analysis() {
  const features = [
    {
      icon: <FileSparkles className="h-8 w-8 text-indigo-600" />,
      emoji: "📄",
      title: "Scientific Paper Summarization",
      description: "Automatically generate concise summaries using advanced language models like BART and T5.",
    },
    {
      icon: <Tag className="h-8 w-8 text-purple-600" />,
      emoji: "🏷",
      title: "Keyword Extraction",
      description: "Extract important keywords and phrases using TF-IDF and transformer models.",
    },
    {
      icon: <BookMarked className="h-8 w-8 text-blue-600" />,
      emoji: "📚",
      title: "Topic Classification",
      description: "Classify papers into scientific domains using state-of-the-art ML models.",
    },
    {
      icon: <Network className="h-8 w-8 text-green-600" />,
      emoji: "🔗",
      title: "Similar Paper Recommendation",
      description: "Discover related papers using Sentence-BERT embeddings and semantic similarity.",
    },
    {
      icon: <FileSearch className="h-8 w-8 text-rose-600" />,
      emoji: "📊",
      title: "Metadata Extraction",
      description: "Extract authors, titles, and journal information using advanced NER techniques.",
    },
    {
      icon: <Brain className="h-8 w-8 text-amber-600" />,
      emoji: "🧠",
      title: "Semantic Understanding",
      description: "Enable intelligent semantic search with vector embeddings and Faiss.",
    },
    {
      icon: <GitFork className="h-8 w-8 text-teal-600" />,
      emoji: "🧮",
      title: "Citation Analysis",
      description: "Analyze citation networks and impact using Semantic Scholar integration.",
    },
    {
      icon: <Layers className="h-8 w-8 text-cyan-600" />,
      emoji: "🧾",
      title: "Section Identification",
      description: "Automatically detect and label paper sections for better navigation.",
    },
  ];

  const stats = [
    {
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      title: "Total Papers",
      value: "24"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Analyzed",
      value: "18"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Authors",
      value: "45"
    },
    {
      icon: <Tag className="h-8 w-8 text-purple-600" />,
      title: "Topics",
      value: "12"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center">
                {stat.icon}
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {feature.icon}
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <span>Try Now</span>
                  <Search className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Papers Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Papers</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    id: '1',
                    title: 'Machine Learning Approaches in Medical Image Analysis',
                    authors: ['John Smith', 'Sarah Johnson'],
                    date: '2024-02-15',
                    status: 'Analyzed'
                  },
                  {
                    id: '2',
                    title: 'Deep Learning in Natural Language Processing',
                    authors: ['Michael Brown', 'Emily Davis'],
                    date: '2024-02-14',
                    status: 'Processing'
                  }
                ].map((paper) => (
                  <tr key={paper.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{paper.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{paper.authors.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{paper.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        paper.status === 'Analyzed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {paper.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

