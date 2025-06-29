import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const SUPABASE_URL = 'https://jpsxgaqgprwduvrdljuy.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwc3hnYXFncHJ3ZHV2cmRsanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzc1MDQsImV4cCI6MjA2NjY1MzUwNH0.3JZar40xrhEwstPl3lqNqszVj9_xNk3NKRgnQWE2x94'

// Check if Supabase is configured
const isSupabaseConfigured = SUPABASE_URL !== 'https://<PROJECT-ID>.supabase.co' && 
                            SUPABASE_ANON_KEY !== '<ANON_KEY>'

let supabase

if (!isSupabaseConfigured) {
  console.warn('Supabase not configured - using mock mode for development')
  // Create a mock client for development
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
            single: () => Promise.resolve({ data: null, error: null })
          }),
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      upsert: () => Promise.resolve({ data: null, error: null })
    }),
    channel: () => ({
      on: () => ({ subscribe: () => {} })
    })
  }
} else {
  // Create real Supabase client
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

export { supabase }
export default supabase