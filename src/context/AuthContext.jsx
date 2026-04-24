import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [role, setRole]       = useState(null)
  const [loading, setLoading] = useState(true)
  const initialized           = useRef(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log('AUTH EVENT:', event)
      // console.log('SESSION:', session)

      // Ignore duplicate events after first load
      if (event === 'TOKEN_REFRESHED' && initialized.current) return

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        // console.log('Fetching role for:', currentUser.id)
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single()
        // console.log('Role data:', data, 'Error:', error)
        setRole(data?.role ?? null)
      } else {
        setRole(null)
      }

      initialized.current = true
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return error
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        role: 'user'
      })
    }
    return null
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // console.log('RENDER — loading:', loading, 'user:', !!user, 'role:', role)

  return (
    <AuthContext.Provider value={{
      user, role, loading,
      isAdmin: role === 'admin',
      isUser:  !!user,
      signIn, signUp, signOut
    }}>
      {loading ? (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <p className="text-stone-400 text-sm">Loading...</p>
        </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)