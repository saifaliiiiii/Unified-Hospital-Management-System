import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Loader2, Send, ShieldCheck } from 'lucide-react'
import { submitFeedback } from '../../services/feedbacks'
import StarRating from './StarRating'

const MAX_LENGTH = 500

function validateFeedback({ rating, feedback }) {
  const errors = {}

  if (!rating) {
    errors.rating = 'Please select a star rating.'
  }

  if (!feedback.trim()) {
    errors.feedback = 'Feedback is required.'
  } else if (feedback.trim().length < 5) {
    errors.feedback = 'Feedback must be at least 5 characters.'
  }

  return errors
}

export default function FeedbackForm({ user, isAuthenticated, authLoading }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const selectedRatingText = useMemo(() => {
    if (!rating) {
      return 'No rating selected'
    }

    return `${rating} out of 5 selected`
  }, [rating])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      setStatus({ type: 'error', message: 'Please login to submit feedback.' })
      return
    }

    const nextErrors = validateFeedback({ rating, feedback })

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus({ type: 'error', message: 'Please fix the highlighted fields.' })
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setStatus({ type: '', message: '' })

    try {
      await submitFeedback({ rating, feedback, isAnonymous })
      setRating(0)
      setHoveredRating(0)
      setFeedback('')
      setIsAnonymous(false)
      setStatus({
        type: 'success',
        message: 'Thank you. Your feedback has been submitted successfully.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to submit feedback. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-emerald-950/15 backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-300/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-50">Share your experience</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Your feedback helps improve the portal for patients and families.
          </p>
        </div>
      </div>

      {!authLoading && !isAuthenticated ? (
        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Please login to submit feedback.{' '}
          <Link to="/login" className="font-semibold text-amber-50 underline underline-offset-4">
            Go to login
          </Link>
        </div>
      ) : user ? (
        <div className="mt-5 rounded-2xl border border-sky-300/15 bg-sky-300/10 px-4 py-3 text-sm text-sky-100">
          Submitting as {user.displayName || user.email || 'Patient'}.
        </div>
      ) : null}

      {status.message ? (
        <div
          className={[
            'mt-5 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm',
            status.type === 'success'
              ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
              : 'border-rose-300/20 bg-rose-300/10 text-rose-100',
          ].join(' ')}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : null}
          <span>{status.message}</span>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-100">
              Rate your experience
            </label>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
              {selectedRatingText}
            </span>
          </div>
          <div className="mt-3">
            <StarRating
              value={rating}
              hoveredValue={hoveredRating}
              onChange={(nextRating) => {
                setRating(nextRating)
                setErrors((current) => ({ ...current, rating: '' }))
              }}
              onHover={setHoveredRating}
            />
          </div>
          {errors.rating ? (
            <p className="mt-2 text-xs font-medium text-rose-300">{errors.rating}</p>
          ) : null}
        </div>

        <label className="grid gap-2 text-sm font-semibold text-slate-100">
          Feedback
          <textarea
            rows={5}
            maxLength={MAX_LENGTH}
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value)
              setErrors((current) => ({ ...current, feedback: '' }))
            }}
            placeholder="Write your feedback here..."
            className="resize-none rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm font-normal leading-6 text-slate-100 outline-none ring-emerald-400/40 transition placeholder:text-slate-500 focus:border-emerald-300/50 focus:ring-2"
          />
          <span className="flex items-center justify-between gap-3 text-xs font-normal">
            <span className={errors.feedback ? 'text-rose-300' : 'text-slate-400'}>
              {errors.feedback || 'Minimum 5 characters.'}
            </span>
            <span className="text-slate-500">
              {feedback.length}/{MAX_LENGTH}
            </span>
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-slate-950 text-emerald-400 focus:ring-emerald-300"
          />
          Submit publicly as Anonymous
        </label>

        <button
          type="submit"
          disabled={isSubmitting || !isAuthenticated}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-500/50 disabled:shadow-none disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Feedback
            </>
          )}
        </button>
      </div>
    </form>
  )
}
