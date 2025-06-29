import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.warn('Auth session error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Auto-redirect on successful login
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, should redirect to dashboard')
          // Note: Navigation should be handled in components, not here
          // This is just for logging/debugging
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    try {
      console.log('Starting sign up process for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        console.error('Supabase signup error:', error)
        throw error
      }

      console.log('Signup response:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { data: null, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      console.log('Starting sign in process for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Supabase signin error:', error)
        throw error
      }

      console.log('Signin successful:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Signin error:', error)
      return { data: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear user state immediately
      setUser(null)
      
      // Redirect to home page after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}