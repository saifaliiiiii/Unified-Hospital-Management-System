import { MessageSquareText } from 'lucide-react'
import StarRating from './StarRating'

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : null

  if (!date) {
    return 'Just now'
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function FeedbackCard({ feedback }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0b1226] p-5 shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-slate-900/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-300/20">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-50">
              {feedback.userName || 'Anonymous'}
            </p>
            <p className="text-xs text-slate-400">{formatDate(feedback.createdAt)}</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-amber-200">
          {feedback.rating}/5
        </span>
      </div>

      <div className="mt-4">
        <StarRating value={feedback.rating || 0} readOnly size="sm" label="Feedback rating" />
      </div>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">
        {feedback.feedback}
      </p>
    </article>
  )
}
