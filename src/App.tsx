import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import {Chat} from './pages/Chat'; // ✅ default import

import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Upload } from './pages/Upload';
import { Search } from './pages/Search';
import { VisualInsights } from './pages/VisualInsights';
import { Features } from './pages/Features';
import { AIAnalysis } from './pages/AIAnalysis';
import { KnowledgeGraph } from './pages/KnowledgeGraph';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/visual-insights" element={<VisualInsights />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/search" element={<Search />} />
          <Route path="/features" element={<Features />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;