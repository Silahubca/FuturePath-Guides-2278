import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AIJobSearchPage from './components/pages/AIJobSearchPage';
import AIEntrepreneurPage from './components/pages/AIEntrepreneurPage';
import FinancialFreedomPage from './components/pages/FinancialFreedomPage';
import BundlePage from './components/pages/BundlePage';
import ContactPage from './components/pages/ContactPage';
import TermsPage from './components/pages/TermsPage';
import PrivacyPage from './components/pages/PrivacyPage';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ai-job-search" element={<AIJobSearchPage />} />
          <Route path="/ai-entrepreneur" element={<AIEntrepreneurPage />} />
          <Route path="/financial-freedom" element={<FinancialFreedomPage />} />
          <Route path="/complete-collection" element={<BundlePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;