import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeToAuthChanges } from '../auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    let isActive = true
    setAuthLoading(true)

    const watchdog = setTimeout(() => {
      if (!isActive) return
      setUser(null)
      setAuthLoading(false)
      setAuthError((current) => current || new Error('Auth initialization timed out.'))
    }, 8000)

    const unsubscribe = subscribeToAuthChanges(
      (nextUser) => {
        if (!isActive) return
        clearTimeout(watchdog)
        setUser(nextUser)
        setAuthLoading(false)
        setAuthError(null)
      },
      (error) => {
        if (!isActive) return
        clearTimeout(watchdog)
        setAuthError(error || new Error('Authentication listener failed.'))
        setUser(null)
        setAuthLoading(false)
      },
    )

    return () => {
      isActive = false
      clearTimeout(watchdog)
      unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      authLoading,
      authError,
      isAuthenticated: Boolean(user),
    }),
    [authError, authLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
