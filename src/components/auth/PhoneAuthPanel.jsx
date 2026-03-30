import { useMemo, useState } from 'react'
import { KeyRound, Phone } from 'lucide-react'
import { sendOTP, verifyOTP } from '../../auth'

const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/
const OTP_PATTERN = /^\d{6}$/

export default function PhoneAuthPanel({
  mode = 'login',
  accent = 'emerald',
  fullName = '',
  onSuccess,
}) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [errors, setErrors] = useState({})
  const [infoMessage, setInfoMessage] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const palette = useMemo(
    () =>
      accent === 'sky'
        ? {
            button: 'bg-sky-400 text-slate-950 hover:bg-sky-300',
            focus: 'focus:border-sky-300/70 focus:ring-sky-400/20',
            badge: 'text-sky-300',
          }
        : {
            button: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
            focus: 'focus:border-emerald-300/70 focus:ring-emerald-400/20',
            badge: 'text-emerald-300',
          },
    [accent],
  )

  const containerId = `${mode}-phone-recaptcha`

  const resetMessages = () => {
    setErrors({})
    setInfoMessage('')
  }

  const validatePhone = () => {
    const normalized = phoneNumber.trim()

    if (!normalized) {
      return 'Phone number is required.'
    }

    if (!PHONE_PATTERN.test(normalized)) {
      return 'Use international format like +919876543210.'
    }

    return ''
  }

  const handleSendOtp = async () => {
    const phoneError = validatePhone()

    if (phoneError) {
      setErrors({ phoneNumber: phoneError })
      setInfoMessage('')
      return
    }

    setIsSendingOtp(true)
    resetMessages()

    try {
      const result = await sendOTP(phoneNumber.trim(), containerId)
      setOtpSent(true)
      setInfoMessage(result.message)
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    const nextErrors = {}

    const phoneError = validatePhone()
    if (phoneError) {
      nextErrors.phoneNumber = phoneError
    }

    if (!otpCode.trim()) {
      nextErrors.otpCode = 'OTP is required.'
    } else if (!OTP_PATTERN.test(otpCode.trim())) {
      nextErrors.otpCode = 'Enter the 6-digit OTP code.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setInfoMessage('')
      return
    }

    setIsVerifyingOtp(true)
    resetMessages()

    try {
      const result = await verifyOTP(otpCode.trim(), {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      })
      setInfoMessage(result.message)
      onSuccess?.(result)
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
      <div className="mb-6">
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${palette.badge}`}>
          Phone Authentication
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-50">
          {mode === 'signup' ? 'Create access with OTP' : 'Login with OTP'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Enter your phone number in international format, request the OTP, then
          verify the code to continue securely.
        </p>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Phone Number
          </span>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value)
                setErrors((current) => ({ ...current, phoneNumber: '', form: '' }))
                setInfoMessage('')
              }}
              placeholder="+919876543210"
              className={`w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:ring-2 ${palette.focus}`}
            />
          </div>
          {errors.phoneNumber ? (
            <p className="mt-2 text-xs text-rose-300">{errors.phoneNumber}</p>
          ) : null}
        </label>

        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isSendingOtp || isVerifyingOtp}
          className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${palette.button}`}
        >
          {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            OTP Code
          </span>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={(event) => {
                setOtpCode(event.target.value.replace(/\D/g, ''))
                setErrors((current) => ({ ...current, otpCode: '', form: '' }))
                setInfoMessage('')
              }}
              placeholder="Enter 6-digit OTP"
              className={`w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:ring-2 ${palette.focus}`}
            />
          </div>
          {errors.otpCode ? (
            <p className="mt-2 text-xs text-rose-300">{errors.otpCode}</p>
          ) : null}
        </label>

        {errors.form ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {errors.form}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {infoMessage}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={!otpSent || isVerifyingOtp || isSendingOtp}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
        </button>

        <div
          id={containerId}
          className="min-h-0"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
