import React from 'react'
import PersonalLearningDashboard from '../dashboard/PersonalLearningDashboard'
import InteractiveCalculators from '../calculators/InteractiveCalculators'
import SEOHead from '../seo/SEOHead'

const PersonalDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Personal Learning Dashboard - Track Your Progress | FuturePath Guides"
        description="Monitor your learning progress, track goals, and access interactive financial calculators in your personalized dashboard."
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <PersonalLearningDashboard />
          <InteractiveCalculators />
        </div>
      </div>
    </div>
  )
}

export default PersonalDashboardPage