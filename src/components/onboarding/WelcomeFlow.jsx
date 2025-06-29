import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheck, FiArrowRight, FiTarget, FiBook, FiTrendingUp, FiUsers } = FiIcons

const WelcomeFlow = ({ onComplete }) => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [userProfile, setUserProfile] = useState({
    goals: [],
    interests: [],
    experience_level: ''
  })
  const [isCompleting, setIsCompleting] = useState(false)

  const steps = [
    {
      title: "Welcome to FuturePath Guides! 🎉",
      subtitle: "Let's personalize your success journey",
      component: WelcomeStep
    },
    {
      title: "What are your main goals?",
      subtitle: "Select all that apply to you",
      component: GoalsStep
    },
    {
      title: "What's your experience level?",
      subtitle: "This helps us recommend the right content",
      component: ExperienceStep
    },
    {
      title: "You're all set! 🚀",
      subtitle: "Let's start your journey to success",
      component: CompletionStep
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    if (isCompleting) return // Prevent double-clicking
    setIsCompleting(true)

    try {
      console.log('Starting onboarding completion...')
      
      // Save user preferences
      const profileData = {
        id: user.id,
        onboarding_completed: true,
        goals: userProfile.goals,
        interests: userProfile.interests,
        experience_level: userProfile.experience_level,
        updated_at: new Date().toISOString()
      }

      console.log('Saving profile data:', profileData)

      const { data: profileResult, error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData)
        .select()

      if (profileError) {
        console.error('Profile save error:', profileError)
        throw profileError
      }

      console.log('Profile saved successfully:', profileResult)

      // Award welcome achievement
      try {
        const { data: achievementResult, error: achievementError } = await supabase
          .from('achievements')
          .insert({
            user_id: user.id,
            title: 'Welcome Aboard!',
            description: 'Completed your profile setup',
            badge_type: 'welcome'
          })

        if (achievementError) {
          console.warn('Achievement creation failed (non-critical):', achievementError)
        } else {
          console.log('Achievement awarded:', achievementResult)
        }
      } catch (achievementErr) {
        console.warn('Achievement error (non-critical):', achievementErr)
      }

      // Add a small delay to ensure database operations complete
      await new Promise(resolve => setTimeout(resolve, 500))

      console.log('Onboarding completed successfully, calling onComplete callback')
      
      // Call the completion callback
      if (onComplete) {
        onComplete()
      } else {
        // Fallback navigation
        console.log('No onComplete callback, redirecting to dashboard')
        window.location.hash = '/dashboard'
      }

    } catch (error) {
      console.error('Error completing onboarding:', error)
      setIsCompleting(false)
      
      // Show error message but still try to complete
      alert('There was an issue saving your preferences, but you can continue to your dashboard.')
      
      if (onComplete) {
        onComplete()
      } else {
        window.location.hash = '/dashboard'
      }
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Progress Bar */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h1>
            <span className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{steps[currentStep].subtitle}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <CurrentStepComponent
              key={currentStep}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              onNext={nextStep}
              isLastStep={currentStep === steps.length - 1}
              isCompleting={isCompleting}
            />
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

const WelcomeStep = ({ onNext }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center"
  >
    <div className="mb-8">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <SafeIcon icon={FiUsers} className="text-3xl text-white" />
      </div>
      <p className="text-lg text-gray-700 leading-relaxed">
        You're now part of a community of ambitious individuals working toward success. 
        Let's set up your profile to give you the best personalized experience.
      </p>
    </div>
    <button
      onClick={onNext}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
    >
      Get Started
    </button>
  </motion.div>
)

const GoalsStep = ({ userProfile, setUserProfile, onNext }) => {
  const goals = [
    { id: 'career', label: 'Advance My Career', icon: FiTrendingUp },
    { id: 'business', label: 'Start a Business', icon: FiTarget },
    { id: 'financial', label: 'Improve Finances', icon: FiTrendingUp },
    { id: 'skills', label: 'Learn New Skills', icon: FiBook },
    { id: 'remote', label: 'Work Remotely', icon: FiUsers },
    { id: 'leadership', label: 'Develop Leadership', icon: FiTarget }
  ]

  const toggleGoal = (goalId) => {
    const currentGoals = userProfile.goals || []
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(g => g !== goalId)
      : [...currentGoals, goalId]
    setUserProfile({ ...userProfile, goals: updatedGoals })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="grid grid-cols-2 gap-4 mb-8">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              userProfile.goals?.includes(goal.id)
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <SafeIcon icon={goal.icon} className="text-2xl mb-2" />
            <span className="font-medium">{goal.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!userProfile.goals?.length}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
      >
        Continue
      </button>
    </motion.div>
  )
}

const ExperienceStep = ({ userProfile, setUserProfile, onNext }) => {
  const experiences = [
    { id: 'beginner', label: 'Beginner', description: 'Just starting my journey' },
    { id: 'intermediate', label: 'Intermediate', description: 'Have some experience' },
    { id: 'advanced', label: 'Advanced', description: 'Experienced and looking to level up' },
    { id: 'expert', label: 'Expert', description: 'Very experienced, seeking specialized insights' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="space-y-3 mb-8">
        {experiences.map((exp) => (
          <button
            key={exp.id}
            onClick={() => setUserProfile({ ...userProfile, experience_level: exp.id })}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              userProfile.experience_level === exp.id
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{exp.label}</div>
            <div className="text-sm text-gray-600">{exp.description}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!userProfile.experience_level}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
      >
        Complete Setup
      </button>
    </motion.div>
  )
}

const CompletionStep = ({ onNext, isLastStep, isCompleting }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center"
  >
    <div className="mb-8">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <SafeIcon icon={FiCheck} className="text-3xl text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Your profile is complete!
      </h3>
      <p className="text-gray-700">
        You're ready to start your journey. We've personalized your experience based on your goals and interests.
      </p>
    </div>
    <button
      onClick={onNext}
      disabled={isCompleting}
      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCompleting ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          <span>Setting up your profile...</span>
        </>
      ) : (
        <>
          <span>Start Your Journey</span>
          <SafeIcon icon={FiArrowRight} />
        </>
      )}
    </button>
  </motion.div>
)

export default WelcomeFlow