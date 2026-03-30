import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function FullScreenLoader({ label }) {
  return (
    <div className="flex min-h-[calc(100vh-145px)] items-center justify-center bg-[#020617] px-4">
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-5 text-center shadow-xl shadow-emerald-950/20">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-emerald-300/20 border-t-emerald-300" />
        <p className="mt-4 text-sm text-slate-300">{label}</p>
      </div>
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth()

  if (authLoading) {
    return <FullScreenLoader label="Checking your secure session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function PublicOnlyRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth()

  if (authLoading) {
    return <FullScreenLoader label="Preparing authentication..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
