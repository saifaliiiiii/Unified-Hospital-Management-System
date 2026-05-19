import { useEffect, useMemo, useState } from 'react'
import { Activity, MessageSquareText, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { subscribeToLatestFeedbacks } from '../../services/feedbacks'
import FeedbackCard from './FeedbackCard'
import FeedbackForm from './FeedbackForm'

export default function FeedbackSection() {
  const { user, isAuthenticated, authLoading } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToLatestFeedbacks(
      (latestFeedbacks) => {
        setFeedbacks(latestFeedbacks)
        setIsLoading(false)
        setLoadError('')
      },
      () => {
        setIsLoading(false)
        setLoadError('Unable to load feedback right now.')
      },
    )

    return unsubscribe
  }, [])

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) {
      return '0.0'
    }

    const total = feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 0), 0)
    return (total / feedbacks.length).toFixed(1)
  }, [feedbacks])

  return (
    <section className="lg:col-span-3" aria-labelledby="feedback-heading">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/20">
        <div className="border-b border-white/10 bg-gradient-to-r from-sky-500/12 via-emerald-400/10 to-transparent p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Feedback
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                id="feedback-heading"
                className="text-3xl font-semibold tracking-tight text-slate-50"
              >
                Help us improve patient care
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Rate your experience, share a short note, and review recent patient
                feedback from the portal community.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-amber-200">
                  <Star className="h-4 w-4 fill-amber-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                    Average
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-50">
                  {averageRating}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-2 text-emerald-200">
                  <MessageSquareText className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                    Total
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-50">
                  {feedbacks.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
          <FeedbackForm
            user={user}
            isAuthenticated={isAuthenticated}
            authLoading={authLoading}
          />

          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-50">
                  Latest feedback
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Recent patient comments from Firestore.
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/12 text-sky-200 ring-1 ring-sky-300/20">
                <Activity className="h-5 w-5" />
              </div>
            </div>

            {loadError ? (
              <div className="mt-5 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                {loadError}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/5 px-5 py-10 text-center">
                <MessageSquareText className="mx-auto h-8 w-8 text-emerald-200" />
                <p className="mt-3 text-sm font-semibold text-slate-100">
                  No feedback yet
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Be the first patient to share your experience.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {feedbacks.slice(0, 6).map((feedback) => (
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
