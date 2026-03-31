import {
  Compass,
  House,
  LogOut,
  Moon,
  PenSquare,
  Sun,
  UserCircle2,
} from 'lucide-react'

const navItems = [
  { label: 'Home', icon: House },
  { label: 'Explore', icon: Compass },
  { label: 'My Posts', icon: PenSquare },
  { label: 'Profile', icon: UserCircle2 },
  { label: 'Logout', icon: LogOut },
]

export default function Sidebar({ darkMode, onToggleTheme }) {
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <p
              className={[
                'text-xs font-semibold uppercase tracking-[0.22em]',
                darkMode ? 'text-sky-300' : 'text-sky-700',
              ].join(' ')}
            >
              CuraNex
            </p>
            <h2
              className={[
                'mt-2 text-2xl font-semibold',
                darkMode ? 'text-white' : 'text-slate-950',
              ].join(' ')}
            >
              Community Hub
            </h2>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={[
              'inline-flex h-11 w-11 items-center justify-center rounded-2xl transition',
              darkMode
                ? 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                : 'bg-sky-100 text-sky-700 hover:bg-sky-200',
            ].join(' ')}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <nav className="mt-6 grid gap-2">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={[
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition',
                index === 0
                  ? darkMode
                    ? 'bg-sky-500/15 text-sky-200'
                    : 'bg-sky-50 text-sky-700'
                  : darkMode
                    ? 'text-slate-200 hover:bg-slate-900'
                    : 'text-slate-700 hover:bg-slate-50',
              ].join(' ')}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
