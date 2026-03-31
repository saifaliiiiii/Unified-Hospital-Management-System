import { ImagePlus } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import PostCard from './PostCard'

const FILTERS = ['All', 'Doctor', 'Patient', 'Awareness']

export default function Feed({
  darkMode,
  composerText,
  onComposerTextChange,
  selectedRole,
  onRoleChange,
  composerImage,
  onImageUpload,
  onCreatePost,
  filterValue,
  onFilterChange,
  filteredPosts,
  onToggleLike,
  onToggleBookmark,
  onShare,
  onAddComment,
}) {
  return (
    <section className="space-y-4">
      <div
        className={[
          'rounded-[28px] border p-5 shadow-sm',
          darkMode
            ? 'border-slate-800 bg-slate-950/80'
            : 'border-sky-100 bg-white/90',
        ].join(' ')}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
              Community Feed
            </p>
            <h2
              className={[
                'mt-2 text-2xl font-semibold',
                darkMode ? 'text-white' : 'text-slate-950',
              ].join(' ')}
            >
              Share your medical experience
            </h2>
          </div>
          <div className="rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
            {composerText.length}/300
          </div>
        </div>

        <textarea
          value={composerText}
          onChange={(event) => onComposerTextChange(event.target.value.slice(0, 300))}
          rows={4}
          placeholder="Share your medical experience..."
          className={[
            'mt-4 w-full resize-none rounded-[24px] border px-4 py-4 text-sm outline-none transition',
            darkMode
              ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-500'
              : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400',
          ].join(' ')}
        />

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {['Doctor', 'Patient', 'Awareness'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onRoleChange(role)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  selectedRole === role
                    ? 'bg-sky-600 text-white'
                    : darkMode
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ].join(' ')}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <ImagePlus className="h-4 w-4 text-sky-600" />
              Add image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
              />
            </label>
            <button
              type="button"
              onClick={onCreatePost}
              disabled={!composerText.trim()}
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
              Post to CuraNex
            </button>
          </div>
        </div>

        {composerImage ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70">
            <img
              src={composerImage}
              alt="Selected upload"
              className="max-h-80 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={[
              'rounded-full px-4 py-2 text-sm font-medium transition',
              filterValue === filter
                ? 'bg-teal-500 text-white'
                : darkMode
                  ? 'bg-slate-950 text-slate-300 hover:bg-slate-900'
                  : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50',
            ].join(' ')}
          >
            {filter}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              darkMode={darkMode}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onShare={onShare}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      </AnimatePresence>
    </section>
  )
}
