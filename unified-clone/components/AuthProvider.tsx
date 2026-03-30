'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { configurePersistence, subscribeToAuthChanges } from '@/lib/auth'

type AuthContextValue = {
  user: User | null
  authLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    configurePersistence().catch((error) => {
      console.error('[auth] persistence:error', error)
    })

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
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
