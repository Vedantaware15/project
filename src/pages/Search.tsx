import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Calendar, User, BookOpen, Presentation as Citation, Download, Bookmark, Share2, ChevronDown, Loader2, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5002/api/semantic';

// Filter options
const YEAR_OPTIONS = [
  { label: 'All Years', value: 'all' },
  { label: 'Last Year', value: new Date().getFullYear() - 1 },
  { label: 'Last 5 Years', value: new Date().getFullYear() - 5 },
  { label: 'Last 10 Years', value: new Date().getFullYear() - 10 },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Most Cited', value: 'citations' },
  { label: 'Most Recent', value: 'year' },
];

const DOCUMENT_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'Journal Article', value: 'journal' },
  { label: 'Conference Paper', value: 'conference' },
  { label: 'Review', value: 'review' },
  { label: 'Book Chapter', value: 'chapter' },
];

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    year: 'all',
    sortBy: 'relevance',
    type: 'all'
  });
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
    total: 0
  });
  const [showFilters, setShowFilters] = useState({
    year: false,
    sortBy: false,
    type: false
  });

  // Function to search papers
  const searchPapers = async (query = searchQuery, offset = 0) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        query,
        limit: pagination.limit,
        offset,
        sortBy: selectedFilters.sortBy,
        type: selectedFilters.type
      };

      // Add year filter
      if (selectedFilters.year !== 'all') {
        params.yearMin = selectedFilters.year;
      }

      const response = await axios.get(`${API_BASE_URL}/search`, { params });
      
      if (offset === 0) {
        setPapers(response.data.data || []);
      } else {
        setPapers(prev => [...prev, ...(response.data.data || [])]);
      }
      
      setPagination(prev => ({
        ...prev,
        offset,
        total: response.data.total || 0
      }));
    } catch (err) {
      console.error('Error fetching papers:', err);
      const errorMessage = err.response?.data?.error || 'Failed to fetch papers. Please try again later.';
      const errorDetails = err.response?.data?.details;
      setError({ message: errorMessage, details: errorDetails });
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    searchPapers(searchQuery, 0);
  };

  // Handle load more
  const handleLoadMore = () => {
    const nextOffset = pagination.offset + pagination.limit;
    searchPapers(searchQuery, nextOffset);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setShowFilters(prev => ({
      ...prev,
      [filterType]: false
    }));
    // Reset pagination and search with new filters
    setPagination(prev => ({ ...prev, offset: 0 }));
    searchPapers(searchQuery, 0);
  };

  // Format authors for display
  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Authors';
    return authors.map(author => author.name).join(', ');
  };

  // Function to render filter dropdown
  const renderFilterDropdown = (type, options, currentValue) => {
    if (!showFilters[type]) return null;

    return (
      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
        <ul className="py-1">
          {options.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => handleFilterChange(type, option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentValue === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Search Academic Papers
          </h1>
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, keywords, or abstract..."
                className="w-full px-6 py-4 rounded-lg shadow-lg text-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
                disabled={loading || !searchQuery.trim()}
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <SearchIcon className="h-6 w-6" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700 font-medium">Filters:</span>
            </div>
            
            {/* Active Filters */}
            {(selectedFilters.year !== 'all' || 
              selectedFilters.sortBy !== 'relevance' || 
              selectedFilters.type !== 'all') && (
              <div className="flex flex-wrap gap-2">
                {selectedFilters.year !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    Since {selectedFilters.year}
                    <button
                      onClick={() => handleFilterChange('year', 'all')}
                      className="ml-2 hover:text-indigo-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {selectedFilters.sortBy !== 'relevance' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    Sort: {SORT_OPTIONS.find(opt => opt.value === selectedFilters.sortBy)?.label}
                    <button
                      onClick={() => handleFilterChange('sortBy', 'relevance')}
                      className="ml-2 hover:text-indigo-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {selectedFilters.type !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                    Type: {DOCUMENT_TYPES.find(opt => opt.value === selectedFilters.type)?.label}
                    <button
                      onClick={() => handleFilterChange('type', 'all')}
                      className="ml-2 hover:text-indigo-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
            
            {/* Year Filter */}
            <div className="relative">
              <button 
                onClick={() => setShowFilters(prev => ({
                  ...prev,
                  year: !prev.year,
                  sortBy: false,
                  type: false
                }))}
                className="flex items-center space-x-2 px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Year</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {renderFilterDropdown('year', YEAR_OPTIONS, selectedFilters.year)}
            </div>

            {/* Sort By Filter */}
            <div className="relative">
              <button 
                onClick={() => setShowFilters(prev => ({
                  ...prev,
                  sortBy: !prev.sortBy,
                  year: false,
                  type: false
                }))}
                className="flex items-center space-x-2 px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                <Citation className="h-4 w-4 text-gray-500" />
                <span>Sort by</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {renderFilterDropdown('sortBy', SORT_OPTIONS, selectedFilters.sortBy)}
            </div>

            {/* Document Type Filter */}
            <div className="relative">
              <button 
                onClick={() => setShowFilters(prev => ({
                  ...prev,
                  type: !prev.type,
                  year: false,
                  sortBy: false
                }))}
                className="flex items-center space-x-2 px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span>Document Type</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {renderFilterDropdown('type', DOCUMENT_TYPES, selectedFilters.type)}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error.message}</p>
                {error.details && (
                  <p className="text-sm text-red-600 mt-1">{error.details}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-6">
          {loading && papers.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600">Searching papers...</span>
            </div>
          ) : papers.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No papers found. Try a different search query or adjust your filters.</p>
            </div>
          ) : papers.length === 0 ? null : (
            <>
              <div className="text-sm text-gray-500 mb-4">
                Found {pagination.total.toLocaleString()} results
              </div>
              {papers.map((paper) => (
                <div key={paper.paperId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <a 
                        href={paper.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 mb-2 block"
                      >
                        {paper.title}
                      </a>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <User className="h-4 w-4 mr-2" />
                        {formatAuthors(paper.authors)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        {paper.venue && <span>{paper.venue}</span>}
                        {paper.venue && paper.year && <span>•</span>}
                        {paper.year && <span>{paper.year}</span>}
                        {(paper.venue || paper.year) && paper.citationCount > 0 && <span>•</span>}
                        {paper.citationCount > 0 && (
                          <span className="flex items-center">
                            <Citation className="h-4 w-4 mr-1" />
                            {paper.citationCount.toLocaleString()} citations
                          </span>
                        )}
                      </div>
                      {paper.abstract && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{paper.abstract}</p>
                      )}
                      {paper.publicationTypes && paper.publicationTypes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {paper.publicationTypes.map((type, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                    {paper.openAccessPdf && (
                      <a 
                        href={paper.openAccessPdf.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-indigo-600"
                      >
                        <Download className="h-5 w-5 mr-1" />
                        <span>PDF</span>
                      </a>
                    )}
                    <button className="flex items-center text-gray-600 hover:text-indigo-600">
                      <Bookmark className="h-5 w-5 mr-1" />
                      <span>Save</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-indigo-600">
                      <Share2 className="h-5 w-5 mr-1" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {papers.length > 0 && papers.length < pagination.total && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}