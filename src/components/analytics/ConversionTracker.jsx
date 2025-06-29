import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useAnalytics } from './AnalyticsProvider'

const ConversionTracker = ({ children }) => {
  const { user } = useAuth()
  const { trackConversion, trackUserAction } = useAnalytics()

  useEffect(() => {
    // Track user registration as conversion
    if (user) {
      trackConversion('user_registration', 0)
    }
  }, [user])

  // Enhanced click tracking
  const handleClick = (event) => {
    const target = event.target.closest('[data-track]')
    if (target) {
      const trackingData = target.dataset.track
      try {
        const data = JSON.parse(trackingData)
        trackUserAction(data.action, data)
      } catch (error) {
        trackUserAction(trackingData)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <>{children}</>
}

export default ConversionTracker