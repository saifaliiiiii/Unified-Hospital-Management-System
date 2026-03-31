import { Search } from 'lucide-react'

export default function RightPanel({
  darkMode,
  searchQuery,
  onSearchChange,
  trendingTopics,
  suggestedUsers,
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div
        className={[
          'rounded-[28px] border p-5 shadow-sm',
          darkMode
            ? 'border-slate-800 bg-slate-950/80'
            : 'border-sky-100 bg-white/85',
        ].join(' ')}
      >
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-500">
          <Search className="h-4 w-4 text-sky-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search posts, symptoms, or doctors"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div
        className={[
          'rounded-[28px] border p-5 shadow-sm',
          darkMode
            ? 'border-slate-800 bg-slate-950/80'
            : 'border-sky-100 bg-white/85',
        ].join(' ')}
      >
        <h3
          className={[
            'text-lg font-semibold',
            darkMode ? 'text-white' : 'text-slate-950',
          ].join(' ')}
        >
          Trending Topics
        </h3>
        <div className="mt-4 space-y-3">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              className={[
                'rounded-2xl px-4 py-3',
                darkMode ? 'bg-slate-900/80' : 'bg-slate-50',
              ].join(' ')}
            >
              <p className="text-sm font-semibold text-sky-600">{topic.tag}</p>
              <p
                className={[
                  'mt-1 text-sm',
                  darkMode ? 'text-slate-300' : 'text-slate-600',
                ].join(' ')}
              >
                {topic.posts} active posts
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={[
          'rounded-[28px] border p-5 shadow-sm',
          darkMode
            ? 'border-slate-800 bg-slate-950/80'
            : 'border-sky-100 bg-white/85',
        ].join(' ')}
      >
        <h3
          className={[
            'text-lg font-semibold',
            darkMode ? 'text-white' : 'text-slate-950',
          ].join(' ')}
        >
          Suggested Doctors & Users
        </h3>
        <div className="mt-4 space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.name} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-semibold text-white shadow-md">
                {user.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    'truncate text-sm font-semibold',
                    darkMode ? 'text-white' : 'text-slate-900',
                  ].join(' ')}
                >
                  {user.name}
                </p>
                <p
                  className={[
                    'text-sm',
                    darkMode ? 'text-slate-400' : 'text-slate-500',
                  ].join(' ')}
                >
                  {user.role}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
