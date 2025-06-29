import React, { createContext, useContext, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import { useLocation } from 'react-router-dom'

const AnalyticsContext = createContext({})

export const AnalyticsProvider = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  // Track page views
  useEffect(() => {
    trackPageView()
  }, [location.pathname])

  const trackPageView = async () => {
    try {
      const eventData = {
        event_type: 'page_view',
        page_path: location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        session_id: getSessionId(),
        user_id: user?.id || null
      }

      await supabase.from('analytics_events').insert(eventData)
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  const trackEvent = async (eventType, eventData = {}) => {
    try {
      const payload = {
        event_type: eventType,
        event_data: eventData,
        page_path: location.pathname,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        session_id: getSessionId(),
        user_id: user?.id || null
      }

      await supabase.from('analytics_events').insert(payload)
    } catch (error) {
      console.error('Event tracking error:', error)
    }
  }

  const trackConversion = async (conversionType, value = 0, productId = null) => {
    await trackEvent('conversion', {
      conversion_type: conversionType,
      value: value,
      product_id: productId,
      currency: 'USD'
    })
  }

  const trackUserAction = async (action, details = {}) => {
    await trackEvent('user_action', {
      action: action,
      ...details
    })
  }

  const trackError = async (errorType, errorMessage, errorStack = null) => {
    await trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      error_stack: errorStack
    })
  }

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  // Enhanced tracking for business metrics
  const trackBusinessMetric = async (metric, value, metadata = {}) => {
    await trackEvent('business_metric', {
      metric: metric,
      value: value,
      ...metadata
    })
  }

  const value = {
    trackEvent,
    trackConversion,
    trackUserAction,
    trackError,
    trackBusinessMetric
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }
  return context
}