import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeToAuthChanges } from '../auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      authLoading,
      isAuthenticated: Boolean(user),
    }),
    [authLoading, user],
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
