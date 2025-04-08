import { Paper, PaperConnection } from '../types/paper';

export const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Science mapping software tools: Review, analysis, and cooperative study among tools',
    authors: ['M. Cobo', 'A. G. López-Herrera', 'E. Herrera-Viedma'],
    year: 2011,
    citations: 2072,
    abstract: 'Science mapping aims to build bibliometric maps that describe how specific disciplines, scientific domains, or research fields are conceptually, intellectually, and socially structured.'
  },
  {
    id: '2',
    title: 'SciMAT: A new science mapping analysis software tool',
    authors: ['M. Cobo', 'A. G. López-Herrera', 'E. Herrera-Viedma'],
    year: 2012,
    citations: 450,
    abstract: 'This paper presents a new science mapping software tool, SciMAT, which incorporates methods for science mapping analysis.'
  },
  {
    id: '3',
    title: 'Bibliometric Methods in Management and Organization',
    authors: ['I. Zupic', 'T. Čater'],
    year: 2014,
    citations: 890,
    abstract: 'A comprehensive overview of bibliometric methods for researchers in management and organization.'
  },
  {
    id: '4',
    title: 'Bibliometric Visualization and Analysis Software',
    authors: ['M. E. Bales', 'D. Wright', 'P. R. Oxley'],
    year: 2019,
    citations: 320,
    abstract: 'A review of software tools for bibliometric visualization and analysis in research.'
  }
];

export const mockConnections: PaperConnection[] = [
  { source: '1', target: '2', weight: 0.8 },
  { source: '1', target: '3', weight: 0.6 },
  { source: '2', target: '4', weight: 0.5 },
  { source: '3', target: '4', weight: 0.4 }
];

export const mockCitationTrends = {
  years: [2018, 2019, 2020, 2021, 2022],
  counts: [156, 234, 312, 289, 345]
};

export const mockTopAuthors = [
  { name: 'M. Cobo', citations: 3200 },
  { name: 'E. Herrera-Viedma', citations: 2800 },
  { name: 'A. G. López-Herrera', citations: 2100 },
  { name: 'I. Zupic', citations: 1200 },
  { name: 'T. Čater', citations: 980 }
];

export const mockTopTopics = [
  { name: 'Bibliometrics', count: 450 },
  { name: 'Science Mapping', count: 380 },
  { name: 'Citation Analysis', count: 320 },
  { name: 'Research Evaluation', count: 280 },
  { name: 'Knowledge Discovery', count: 250 }
]; 