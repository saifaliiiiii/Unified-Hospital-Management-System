import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Chrome, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { login, loginWithGoogle } from '../auth'
import AuthShell from '../components/auth/AuthShell'

const initialForm = {
  identifier: '',
  password: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
      form: '',
    }))
    setSuccessMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.identifier.trim()) {
      nextErrors.identifier = 'Email or username is required.'
    } else if (
      formData.identifier.includes('@') &&
      !EMAIL_PATTERN.test(formData.identifier.trim())
    ) {
      nextErrors.identifier = 'Please enter a valid email address.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.trim().length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      const result = await login(formData.identifier.trim(), formData.password)
      setErrors({})
      setSuccessMessage(result.message)
      // Let the auth state listener resolve before ProtectedRoute evaluates.
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const result = await loginWithGoogle()
      setSuccessMessage(result.message)
      // Let the auth state listener resolve before ProtectedRoute evaluates.
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthShell
      badge="Secure Access"
      title="Login to your hospital portal"
      description="Use email and password (or Google sign-in) to access the Unified Clone patient dashboard and hospital services."
      accent="emerald"
      asideTitle="Authentication options"
      asideDescription="Use email/password or Google sign-in while preserving the existing portal navigation, protected routes, and responsive Tailwind styling."
      asidePoints={[
        'Email and password login for standard staff and patient access.',
        'Google sign-in for quick onboarding with existing Google accounts.',
      ]}
    >
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-emerald-950/30 backdrop-blur sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
            Email Login
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Access hospital services, patient support, and health resources in one
            place.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Email or Username
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your email or username"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
            {errors.identifier ? (
              <p className="mt-2 text-xs text-rose-300">{errors.identifier}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-400/20"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-2 text-xs text-rose-300">{errors.password}</p>
            ) : null}
          </label>

          {errors.form ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {errors.form}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-500/60 disabled:text-slate-900"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Chrome className="h-4 w-4" />
            {isGoogleLoading ? 'Connecting Google...' : 'Continue with Google'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
