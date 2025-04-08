export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  keywords: string[];
  pdf_url: string;
  uploaded_by: string;
  created_at: string;
  analysis?: PaperAnalysis;
}

export interface PaperAnalysis {
  summary: string;
  key_findings: string[];
  methodology: string;
  citations: Citation[];
  topics: string[];
}

export interface Citation {
  title: string;
  authors: string[];
  year: number;
  doi?: string;
}