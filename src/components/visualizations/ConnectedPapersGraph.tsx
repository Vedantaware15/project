import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Dialog } from '@/components/ui/dialog';
import { X, BarChart2 } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  abstract?: string;
}

interface PaperConnection {
  source: string;
  target: string;
  weight: number;
}

interface ConnectedPapersGraphProps {
  papers?: Paper[];
  connections?: PaperConnection[];
  onSearchSubmit?: (query: string) => void;
}

export function ConnectedPapersGraph({ 
  papers = [], 
  connections = [],
  onSearchSubmit 
}: ConnectedPapersGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele) => {
              const year = parseInt(ele.data('year'));
              // Color gradient from light blue to dark blue based on year
              const hue = 200; // Blue hue
              const saturation = 80;
              const lightness = Math.max(30, 80 - ((year - 2010) * 5)); // Older papers are darker
              return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            },
            'width': 'data(size)',
            'height': 'data(size)',
            'label': 'data(label)',
            'font-size': '10px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '100px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#ccc',
            'opacity': 0.6,
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      }
    });

    // Add event listeners
    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      const paper = papers.find(p => p.id === node.id());
      if (paper) {
        setSelectedPaper(paper);
      }
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, []);

  // Update graph data when papers or connections change
  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cyRef.current;
    cy.elements().remove();

    // Add nodes
    papers.forEach(paper => {
      cy.add({
        group: 'nodes',
        data: {
          id: paper.id,
          label: paper.title,
          year: paper.year,
          size: Math.max(30, Math.min(80, paper.citations / 10)) // Size based on citations
        }
      });
    });

    // Add edges
    connections.forEach(conn => {
      cy.add({
        group: 'edges',
        data: {
          source: conn.source,
          target: conn.target,
          weight: conn.weight
        }
      });
    });

    cy.layout({ name: 'cose' }).run();
  }, [papers, connections]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="Search papers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="relative flex-1 min-h-[600px] bg-gray-50 rounded-lg overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      {selectedPaper && (
        <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed inset-y-0 right-0 w-[400px] bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedPaper.title}</h3>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {selectedPaper.authors.join(', ')} • {selectedPaper.year}
              </div>
              
              {selectedPaper.abstract && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Abstract</h4>
                  <p className="text-gray-700 text-sm">{selectedPaper.abstract}</p>
                </div>
              )}
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Citations: {selectedPaper.citations}</span>
                </div>
                <button
                  onClick={() => window.open(`/papers/${selectedPaper.id}`, '_blank')}
                  className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}