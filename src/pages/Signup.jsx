import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { loginWithGoogle, signup } from '../auth'
import AuthShell from '../components/auth/AuthShell'
import FirebaseSetupChecklist from '../components/auth/FirebaseSetupChecklist'
import PhoneAuthPanel from '../components/auth/PhoneAuthPanel'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

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

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.trim().length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    }

    if (
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password !== formData.confirmPassword
    ) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.info('[ui] Signup form submitted', { email: formData.email.trim() })

    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      console.warn('[ui] Signup validation failed', nextErrors)
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      const result = await signup(formData.email.trim(), formData.password, {
        fullName: formData.fullName.trim(),
      })
      setErrors({})
      setSuccessMessage(result.message)
      navigate('/dashboard')
    } catch (error) {
      console.error('[ui] Signup request failed', error)
      setErrors({ form: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignup = async () => {
    console.info('[ui] Google signup button clicked')
    setIsGoogleLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const result = await loginWithGoogle()
      setSuccessMessage(result.message)
      navigate('/dashboard')
    } catch (error) {
      console.error('[ui] Google signup request failed', error)
      setErrors({ form: error.message })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <AuthShell
      badge="Create Account"
      title="Sign up for the Punjab hospital portal"
      description="Create a new patient or staff account with email/password, continue with Google, or complete phone verification using Firebase OTP."
      accent="sky"
      asideTitle="Unified onboarding"
      asideDescription="Signup stays connected to the existing portal routes and navbar actions, and successful auth immediately unlocks the protected dashboard."
      asidePoints={[
        'Full name is saved to Firebase Auth profile and Firestore user records.',
        'Google signup shares the same dashboard redirect and auth state listener.',
        'Phone OTP verification can create a fresh Firebase Auth user on first use.',
      ]}
    >
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-sky-950/30 backdrop-blur sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
            Email Signup
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create your profile to manage appointments, records, and support
            requests.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Full Name
            </span>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
            {errors.fullName ? (
              <p className="mt-2 text-xs text-rose-300">{errors.fullName}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
            {errors.email ? (
              <p className="mt-2 text-xs text-rose-300">{errors.email}</p>
            ) : null}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="Create password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
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

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Confirm Password
              </span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="mt-2 text-xs text-rose-300">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </label>
          </div>

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
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-400/30 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-sky-500/60 disabled:text-slate-900"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-300/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Chrome className="h-4 w-4" />
            {isGoogleLoading ? 'Connecting Google...' : 'Sign up with Google'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-sky-300 transition hover:text-sky-200"
          >
            Login
          </Link>
        </p>
      </div>

      <PhoneAuthPanel
        mode="signup"
        accent="sky"
        fullName={formData.fullName}
        onSuccess={() => navigate('/dashboard')}
      />

      <FirebaseSetupChecklist />
    </AuthShell>
  )
}
