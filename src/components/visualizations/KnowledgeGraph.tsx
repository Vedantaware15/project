import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Paper, AuthorStats, TopicStats } from '../../types/paper';

interface KnowledgeGraphProps {
  papers?: Paper[];
  authors?: AuthorStats[];
  topics?: TopicStats[];
  onSearchSubmit?: (query: string) => void;
}

export function KnowledgeGraph({
  papers = [],
  authors = [],
  topics = [],
  onSearchSubmit
}: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-size': '10px',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            'text-valign': 'bottom',
            'text-halign': 'center',
          }
        },
        {
          selector: 'node[type="paper"]',
          style: {
            'background-color': '#4299e1',
            'shape': 'ellipse'
          }
        },
        {
          selector: 'node[type="author"]',
          style: {
            'background-color': '#48bb78',
            'shape': 'diamond'
          }
        },
        {
          selector: 'node[type="topic"]',
          style: {
            'background-color': '#ed64a6',
            'shape': 'hexagon'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#cbd5e0',
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

    return () => {
      cyRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cyRef.current;
    cy.elements().remove();

    // Add paper nodes
    papers.forEach(paper => {
      cy.add({
        group: 'nodes',
        data: {
          id: `p-${paper.id}`,
          label: paper.title,
          type: 'paper'
        }
      });

      // Add author connections
      paper.authors.forEach(author => {
        const authorId = `a-${author.replace(/\s+/g, '-')}`;
        if (!cy.getElementById(authorId).length) {
          cy.add({
            group: 'nodes',
            data: {
              id: authorId,
              label: author,
              type: 'author'
            }
          });
        }
        cy.add({
          group: 'edges',
          data: {
            source: authorId,
            target: `p-${paper.id}`
          }
        });
      });
    });

    // Add topic nodes and connections
    topics.forEach(topic => {
      const topicId = `t-${topic.name.replace(/\s+/g, '-')}`;
      cy.add({
        group: 'nodes',
        data: {
          id: topicId,
          label: topic.name,
          type: 'topic'
        }
      });

      // Connect topics to relevant papers (this is a simplified example)
      papers.forEach(paper => {
        if (paper.title.toLowerCase().includes(topic.name.toLowerCase())) {
          cy.add({
            group: 'edges',
            data: {
              source: topicId,
              target: `p-${paper.id}`
            }
          });
        }
      });
    });

    cy.layout({ name: 'cose' }).run();
  }, [papers, authors, topics]);

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
            placeholder="Search papers, authors, or topics..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="relative flex-1 min-h-[600px] bg-gray-50 rounded-lg overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600">Papers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rotate-45" />
          <span className="text-sm text-gray-600">Authors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-pink-500 rotate-45" />
          <span className="text-sm text-gray-600">Topics</span>
        </div>
      </div>
    </div>
  );
}