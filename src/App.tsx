import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { Chat } from './pages/Chat';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Upload } from './pages/Upload';
import { Search } from './pages/Search';
import { VisualInsights } from './pages/VisualInsights';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;