'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Chrome, Eye, EyeOff, KeyRound, LockKeyhole, Mail, Smartphone, UserRound } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { loginWithGoogle, sendOTP, signup, verifyOTP } from '@/lib/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  otpCode: '',
}

export default function SignupPage() {
  const router = useRouter()
  const { isAuthenticated, authLoading } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isOtpSending, setIsOtpSending] = useState(false)
  const [isOtpVerifying, setIsOtpVerifying] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [authLoading, isAuthenticated, router])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
      otp: '',
      form: '',
    }))
    setSuccessMessage('')
  }

  const validateSignupForm = () => {
    const nextErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
      nextErrors.email = 'Invalid email address.'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.trim().length < 6) {
      nextErrors.password = 'Weak password. Use at least 6 characters.'
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    return nextErrors
  }

  const validatePhoneForm = () => {
    const nextErrors: Record<string, string> = {}

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Phone number is required.'
    } else if (!formData.phoneNumber.trim().startsWith('+')) {
      nextErrors.phoneNumber = 'Use country code, for example +919876543210.'
    }

    if (otpSent && !formData.otpCode.trim()) {
      nextErrors.otp = 'OTP is required.'
    }

    return nextErrors
  }

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateSignupForm()

    if (Object.keys(nextErrors).length > 0) {
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
      router.push('/dashboard')
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Signup failed.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const result = await loginWithGoogle({ fullName: formData.fullName.trim() })
      setSuccessMessage(result.message)
      router.push('/dashboard')
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Google sign-up failed.' })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSendOtp = async () => {
    const nextErrors = validatePhoneForm()

    if (nextErrors.phoneNumber) {
      setErrors(nextErrors)
      return
    }

    setIsOtpSending(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const result = await sendOTP(formData.phoneNumber.trim(), 'signup-recaptcha-container')
      setOtpSent(true)
      setSuccessMessage(result.message)
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to send OTP.' })
    } finally {
      setIsOtpSending(false)
    }
  }

  const handleVerifyOtp = async () => {
    const nextErrors = validatePhoneForm()

    if (nextErrors.otp) {
      setErrors(nextErrors)
      return
    }

    setIsOtpVerifying(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const result = await verifyOTP(formData.otpCode.trim(), {
        fullName: formData.fullName.trim(),
      })
      setSuccessMessage(result.message)
      router.push('/dashboard')
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'OTP verification failed.' })
    } finally {
      setIsOtpVerifying(false)
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.2),_transparent_35%)]" />

      <div className="relative w-full max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-sky-950/30 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Create Account
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
            Sign up for the portal
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Register with email, Google, or phone OTP inside the existing Punjab Hospital portal.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <form className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-5" onSubmit={handleEmailSignup} noValidate>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-50">Create Account with Email</h2>
                <p className="text-sm text-slate-400">Use your name, email, and password to create a portal account.</p>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Full Name</span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
              {errors.fullName ? <p className="mt-2 text-xs text-rose-300">{errors.fullName}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>
              {errors.email ? <p className="mt-2 text-xs text-rose-300">{errors.email}</p> : null}
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-xs text-rose-300">{errors.password}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/20"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword ? <p className="mt-2 text-xs text-rose-300">{errors.confirmPassword}</p> : null}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-400/30 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-sky-500/60"
            >
              {isSubmitting ? 'Creating account...' : 'Signup'}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading || isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-300/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Chrome className="h-4 w-4" />
              {isGoogleLoading ? 'Connecting Google...' : 'Continue with Google'}
            </button>
          </form>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-50">Signup with Phone OTP</h2>
                <p className="text-sm text-slate-400">Send OTP to your mobile number and verify it to create access.</p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Phone Number</span>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+919876543210"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
                {errors.phoneNumber ? <p className="mt-2 text-xs text-rose-300">{errors.phoneNumber}</p> : null}
              </label>

              {otpSent ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">OTP Code</span>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      name="otpCode"
                      value={formData.otpCode}
                      onChange={handleChange}
                      placeholder="Enter the 6-digit OTP"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>
                  {errors.otp ? <p className="mt-2 text-xs text-rose-300">{errors.otp}</p> : null}
                </label>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isOtpSending}
                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isOtpSending ? 'Sending OTP...' : 'Send OTP'}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otpSent || isOtpVerifying}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
                >
                  {isOtpVerifying ? 'Verifying OTP...' : 'Verify OTP'}
                </button>
              </div>
            </div>

            <div id="signup-recaptcha-container" className="mt-4 min-h-0" />
          </div>
        </div>

        {errors.form ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {errors.form}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-sky-300 transition hover:text-sky-200">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}
