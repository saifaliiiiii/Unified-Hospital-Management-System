import { useMemo, useState } from 'react'
import { Bookmark, Heart, MessageCircle, Repeat2, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function PostCard({
  post,
  darkMode,
  onToggleLike,
  onToggleBookmark,
  onShare,
  onAddComment,
}) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const formattedTimestamp = useMemo(
    () => formatTimestamp(post.timestamp),
    [post.timestamp],
  )

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        'rounded-[28px] border p-5 shadow-sm transition',
        darkMode
          ? 'border-slate-800 bg-slate-950/80'
          : 'border-sky-100 bg-white/90',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-semibold text-white shadow-md">
          {post.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={[
                'text-sm font-semibold',
                darkMode ? 'text-white' : 'text-slate-950',
              ].join(' ')}
            >
              {post.author}
            </h3>
            <span
              className={[
                'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                post.role === 'Doctor'
                  ? darkMode
                    ? 'bg-emerald-500/15 text-emerald-200'
                    : 'bg-emerald-50 text-emerald-700'
                  : darkMode
                    ? 'bg-sky-500/15 text-sky-200'
                    : 'bg-sky-50 text-sky-700',
              ].join(' ')}
            >
              {post.role}
            </span>
            {post.verified ? (
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                  darkMode
                    ? 'bg-teal-500/15 text-teal-200'
                    : 'bg-teal-50 text-teal-700',
                ].join(' ')}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Doctor Verified
              </span>
            ) : null}
            <span
              className={darkMode ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}
            >
              {formattedTimestamp}
            </span>
          </div>

          <p
            className={[
              'mt-3 whitespace-pre-wrap text-sm leading-7',
              darkMode ? 'text-slate-200' : 'text-slate-700',
            ].join(' ')}
          >
            {post.content}
          </p>

          {post.image ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
              <img
                src={post.image}
                alt="Post attachment"
                className="max-h-80 w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className={[
              'mt-4 flex flex-wrap items-center gap-2 border-t pt-4',
              darkMode ? 'border-slate-800' : 'border-slate-100',
            ].join(' ')}
          >
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              className={[
                'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
                post.liked
                  ? 'bg-rose-500/10 text-rose-500'
                  : darkMode
                    ? 'text-slate-300 hover:bg-slate-900'
                    : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <Heart className={['h-4 w-4', post.liked ? 'fill-rose-500' : ''].join(' ')} />
              {post.likes}
            </button>

            <button
              type="button"
              onClick={() => setShowComments((value) => !value)}
              className={[
                'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
                darkMode ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <MessageCircle className="h-4 w-4" />
              {post.comments.length}
            </button>

            <button
              type="button"
              onClick={() => onShare(post.id)}
              className={[
                'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
                darkMode ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <Repeat2 className="h-4 w-4" />
              {post.shares}
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(post.id)}
              className={[
                'ml-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
                post.bookmarked
                  ? 'bg-sky-500/10 text-sky-600'
                  : darkMode
                    ? 'text-slate-300 hover:bg-slate-900'
                    : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <Bookmark
                className={[
                  'h-4 w-4',
                  post.bookmarked ? 'fill-sky-500 text-sky-500' : '',
                ].join(' ')}
              />
              Save
            </button>
          </div>

          {showComments ? (
            <div
              className={[
                'mt-4 rounded-2xl border p-4',
                darkMode
                  ? 'border-slate-800 bg-slate-900/70'
                  : 'border-slate-100 bg-slate-50/80',
              ].join(' ')}
            >
              <div className="space-y-3">
                {post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment.id}>
                      <p
                        className={[
                          'text-sm font-semibold',
                          darkMode ? 'text-white' : 'text-slate-900',
                        ].join(' ')}
                      >
                        {comment.author}
                      </p>
                      <p
                        className={[
                          'mt-1 text-sm',
                          darkMode ? 'text-slate-300' : 'text-slate-600',
                        ].join(' ')}
                      >
                        {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-500'}>
                    No comments yet. Start the conversation.
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Add a thoughtful comment..."
                  className={[
                    'min-w-0 flex-1 rounded-2xl border px-4 py-3 text-sm outline-none',
                    darkMode
                      ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500'
                      : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = commentText.trim()
                    if (!trimmed) {
                      return
                    }
                    onAddComment(post.id, trimmed)
                    setCommentText('')
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Comment
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}
