import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CitationNetwork } from './CitationNetwork';
import { ConnectedPapersGraph } from './ConnectedPapersGraph';
import { KnowledgeGraph } from './KnowledgeGraph';
import { Paper, PaperConnection, CitationTrend, AuthorStats, TopicStats } from '../../types/paper';

interface VisualInsightsProps {
  papers?: Paper[];
  connections?: PaperConnection[];
  citationTrends?: {
    years: number[];
    counts: number[];
  };
  topAuthors?: AuthorStats[];
  topTopics?: TopicStats[];
}

export function VisualInsights({
  papers = [],
  connections = [],
  citationTrends = { years: [], counts: [] },
  topAuthors = [],
  topTopics = []
}: VisualInsightsProps) {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality
  };

  return (
    <Tabs defaultValue="connected-papers" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="connected-papers">Connected Papers</TabsTrigger>
        <TabsTrigger value="citation-network">Citation Network</TabsTrigger>
        <TabsTrigger value="knowledge-graph">Knowledge Graph</TabsTrigger>
      </TabsList>
      <TabsContent value="connected-papers">
        <ConnectedPapersGraph
          papers={papers}
          connections={connections}
          onSearchSubmit={handleSearch}
        />
      </TabsContent>
      <TabsContent value="citation-network">
        <CitationNetwork citationTrends={citationTrends} />
      </TabsContent>
      <TabsContent value="knowledge-graph">
        <KnowledgeGraph
          papers={papers}
          authors={topAuthors}
          topics={topTopics}
          onSearchSubmit={handleSearch}
        />
      </TabsContent>
    </Tabs>
  );
} 