import React, { useState } from 'react';
import { FileText, BookOpen, Users, Tag, Brain, Search, FileSearch, BookMarked, Sparkles as FileSparkles, Network, GitFork, Layers } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import axios from 'axios';

export function Analysis() {
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);
  const [showKeywordsPopup, setShowKeywordsPopup] = useState(false);
  const [showRecommendationsPopup, setShowRecommendationsPopup] = useState(false);
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) return alert("Please upload a PDF first!");
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/upload', formData);
      setPdfText(res.data.text);
      alert('PDF uploaded and text extracted!');
    } catch (error) {
      console.error(error);
      alert('Failed to upload or extract PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!pdfText) return alert("Please upload a PDF first!");

    try {
      setLoading(true);
      
      // Truncate PDF text if it's too large
      const truncatedText = pdfText.length > 10000 
        ? pdfText.substring(0, 10000) + "... (text truncated)" 
        : pdfText;
      
      console.log(`Sending request for summarization with text length: ${truncatedText.length}`);
      
      const res = await axios.post('http://localhost:5000/summarize', {
        pdf_text: truncatedText
      });
      
      console.log('Summary response received:', res.data);
      setSummary(res.data.summary);
      setShowSummaryPopup(true);
    } catch (error) {
      console.error('Error details:', error);
      
      // Extract more detailed error information
      let errorMessage = 'Failed to generate summary.';
      let errorDetails = '';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
          if (error.response.data.details) {
            errorDetails = error.response.data.details;
          }
        }
      }
      
      // Show error in popup instead of alert
      setSummary(`Error: ${errorMessage}\n\n${errorDetails}`);
      setShowSummaryPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractKeywords = async () => {
    if (!pdfText) return alert("Please upload a PDF first!");

    try {
      setLoading(true);
      
      // Truncate PDF text if it's too large
      const truncatedText = pdfText.length > 10000 
        ? pdfText.substring(0, 10000) + "... (text truncated)" 
        : pdfText;
      
      console.log(`Sending request for keyword extraction with text length: ${truncatedText.length}`);
      
      const res = await axios.post('http://localhost:5000/extract-keywords', {
        pdf_text: truncatedText
      });
      
      console.log('Keywords response received:', res.data);
      setKeywords(res.data.keywords);
      setShowKeywordsPopup(true);
    } catch (error) {
      console.error('Error details:', error);
      
      // Extract more detailed error information
      let errorMessage = 'Failed to extract keywords.';
      let errorDetails = '';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
          if (error.response.data.details) {
            errorDetails = error.response.data.details;
          }
        }
      }
      
      // Show error in popup instead of alert
      setKeywords(`Error: ${errorMessage}\n\n${errorDetails}`);
      setShowKeywordsPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendSimilarPapers = async () => {
    if (!pdfText) return alert("Please upload a PDF first!");

    try {
      setLoading(true);
      
      // Truncate PDF text if it's too large
      const truncatedText = pdfText.length > 10000 
        ? pdfText.substring(0, 10000) + "... (text truncated)" 
        : pdfText;
      
      console.log(`Sending request for similar paper recommendations with text length: ${truncatedText.length}`);
      
      const res = await axios.post('http://localhost:5000/recommend-similar-papers', {
        pdf_text: truncatedText
      });
      
      console.log('Recommendations response received:', res.data);
      setRecommendations(res.data.recommendations);
      setShowRecommendationsPopup(true);
    } catch (error) {
      console.error('Error details:', error);
      
      // Extract more detailed error information
      let errorMessage = 'Failed to generate paper recommendations.';
      let errorDetails = '';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
          if (error.response.data.details) {
            errorDetails = error.response.data.details;
          }
        }
      }
      
      // Show error in popup instead of alert
      setRecommendations(`Error: ${errorMessage}\n\n${errorDetails}`);
      setShowRecommendationsPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FileSparkles className="h-8 w-8 text-indigo-600" />,
      emoji: "📄",
      title: "Scientific Paper Summarization",
      description: "Automatically generate concise summaries using advanced language models like BART and T5.",
      onClick: handleSummarize
    },
    {
      icon: <Tag className="h-8 w-8 text-purple-600" />,
      emoji: "🏷",
      title: "Keyword Extraction",
      description: "Extract important keywords and phrases using TF-IDF and transformer models.",
      onClick: handleExtractKeywords
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
      onClick: handleRecommendSimilarPapers
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paper Analysis</h1>
        <p className="mt-2 text-lg text-gray-600">
          Upload your research paper to get started with AI-powered analysis
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="mb-4">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          
          <button
            onClick={handleUpload}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading || !pdfFile}
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </div>
      </div>

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
                <button 
                  onClick={feature.onClick}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                  disabled={loading || !pdfText}
                >
                  <span>{loading ? 'Processing...' : 'Try Now'}</span>
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
      
      {/* Summary Popup */}
      {showSummaryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Scientific Paper Summary</h2>
                <button 
                  onClick={() => setShowSummaryPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="prose max-w-none">
                  {summary.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Keywords Popup */}
      {showKeywordsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Extracted Keywords</h2>
                <button 
                  onClick={() => setShowKeywordsPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="prose max-w-none">
                  {keywords.split('\n').map((line, index) => (
                    <p key={index} className="mb-4">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recommendations Popup */}
      {showRecommendationsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Similar Paper Recommendations</h2>
                <button 
                  onClick={() => setShowRecommendationsPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="prose max-w-none">
                  {recommendations.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

