import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, Search, BarChart2, MessageSquare, Network } from 'lucide-react';

export function Home() {
  const features = [
    {
      id: 'summarization',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze papers for key findings, methodology, and insights.',
      icon: Brain
    },
    {
      id: 'visual',
      title: 'Visual Insights',
      description: 'Interactive visualizations of research trends, citations, and relationships between papers.',
      icon: BarChart2
    },
    {
      id: 'chat',
      title: 'Research Assistant Chat',
      description: 'Ask questions about papers and get intelligent responses based on the content.',
      icon: MessageSquare
    },
    {
      id: 'knowledge',
      title: 'Knowledge Graph',
      description: 'Explore connections between papers, authors, and research topics.',
      icon: Network
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Analyze Research Papers</span>
                  <span className="block text-indigo-600">with AI Intelligence</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Upload your scientific papers and let our AI analyze them for key insights, trends, and connections. Get comprehensive summaries, extract important findings, and explore research through an intelligent chat interface.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/upload" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      <FileText className="h-5 w-5 mr-2" />
                      Upload Paper
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/search" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                      <Search className="h-5 w-5 mr-2" />
                      Search Papers
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Intelligent Paper Analysis
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.id} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.id === 'visual' ? '/visual-insights' : '/analysis'}
                    className="mt-3 ml-16 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Try Now <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}