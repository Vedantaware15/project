export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  abstract?: string;
}

export interface PaperConnection {
  source: string;
  target: string;
  weight: number;
}

export interface CitationTrend {
  year: number;
  count: number;
}

export interface AuthorStats {
  name: string;
  citations: number;
}

export interface TopicStats {
  name: string;
  count: number;
} 