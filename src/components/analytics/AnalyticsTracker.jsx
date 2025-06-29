import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const AnalyticsTracker = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page views
    trackPageView()
  }, [location])

  const trackPageView = async () => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'page_view',
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  // Track custom events
  const trackEvent = async (eventType, eventData = {}) => {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          event_data: eventData,
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Event tracking error:', error)
    }
  }

  // Make trackEvent available globally
  useEffect(() => {
    window.trackEvent = trackEvent
  }, [])

  return null // This component doesn't render anything
}

export default AnalyticsTracker