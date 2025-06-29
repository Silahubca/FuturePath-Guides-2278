import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QuestProvider } from '@questlabs/react-sdk'
import '@questlabs/react-sdk/dist/style.css'
import { AuthProvider } from './hooks/useAuth.jsx'
import questConfig from './config/questConfig'
import AnalyticsTracker from './components/analytics/AnalyticsTracker'
import Header from './components/navigation/Header'
import HelpHub from './components/help/HelpHub'
import FeedbackButton from './components/feedback/FeedbackButton'
import LandingPage from './components/LandingPage'
import AIJobSearchPage from './components/pages/AIJobSearchPage'
import AIEntrepreneurPage from './components/pages/AIEntrepreneurPage'
import FinancialFreedomPage from './components/pages/FinancialFreedomPage'
import BundlePage from './components/pages/BundlePage'
import ContactPage from './components/pages/ContactPage'
import TermsPage from './components/pages/TermsPage'
import PrivacyPage from './components/pages/PrivacyPage'
import DashboardPage from './components/pages/DashboardPage'
import PersonalDashboardPage from './components/pages/PersonalDashboardPage'
import CheckoutPage from './components/pages/CheckoutPage'
import SuccessPage from './components/pages/SuccessPage'
import CancelPage from './components/pages/CancelPage'
import WishlistPage from './components/pages/WishlistPage'
import GetStartedPage from './components/pages/GetStartedPage'
import AdminDashboard from './components/admin/AdminDashboard'
import BookLibrary from './components/reading/BookLibrary'
import UserProfile from './components/profile/UserProfile'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <QuestProvider
          apiKey={questConfig.APIKEY}
          entityId={questConfig.ENTITYID}
          apiType="PRODUCTION"
        >
          <Router>
            <div className="App min-h-screen bg-white dark:bg-gray-900 transition-colors">
              <AnalyticsTracker />
              <Header />
              
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/ai-job-search" element={<AIJobSearchPage />} />
                <Route path="/ai-entrepreneur" element={<AIEntrepreneurPage />} />
                <Route path="/financial-freedom" element={<FinancialFreedomPage />} />
                <Route path="/complete-collection" element={<BundlePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms-of-service" element={<TermsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPage />} />
                <Route path="/checkout/:productId" element={<CheckoutPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/personal-dashboard" element={<PersonalDashboardPage />} />
                <Route path="/library" element={<BookLibrary />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/get-started" element={<GetStartedPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/cancel" element={<CancelPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>

              {/* Global Components */}
              <HelpHub />
              <FeedbackButton />
            </div>
          </Router>
        </QuestProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App