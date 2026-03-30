import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, Stethoscope } from 'lucide-react'
import { FIND_HOSPITALS_PATH } from '../utils/findHospitalRoute'
import { useAuth } from '../context/AuthContext'
import { logout } from '../auth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const exploreItems = useMemo(
    () => [
      { label: 'Health Tips', to: '/health-tips' },
      { label: 'Blogs', to: '/blogs' },
      { label: 'Research', to: '/research' },
      { label: 'Patient Stories', to: '/patient-stories' },
    ],
    [],
  )

  const closeMobileMenu = () => {
    setMobileOpen(false)
    setMobileExploreOpen(false)
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      closeMobileMenu()
      navigate('/login')
    } catch (error) {
      console.error(error.message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-slate-950 shadow-lg shadow-emerald-500/40">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
              Punjab
            </span>
            <span className="text-sm font-semibold text-slate-50">
              Unified Health Portal
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <Link to={FIND_HOSPITALS_PATH} className="hover:text-emerald-300">
            Find Hospitals
          </Link>
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 hover:text-emerald-300"
              aria-haspopup="menu"
            >
              Explore
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
            </button>

            <div className="absolute left-0 top-full z-50 pt-2">
              <div className="invisible w-56 translate-y-2 rounded-2xl border border-white/10 bg-[#0b1226] p-2 opacity-0 shadow-lg shadow-black/30 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {exploreItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-emerald-200"
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-500">-&gt;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/support" className="hover:text-emerald-300">
            Support
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:border-emerald-300/80 hover:text-emerald-200"
              >
                {user?.displayName || 'Dashboard'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-400/50 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:border-emerald-300/80 hover:text-emerald-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-400/50 transition hover:bg-emerald-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-200 md:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#020617] md:hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-2 text-sm font-medium text-slate-200">
              <Link
                to={FIND_HOSPITALS_PATH}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white/10"
                onClick={closeMobileMenu}
              >
                Find Hospitals
              </Link>

              <button
                type="button"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white/10"
                onClick={() => setMobileExploreOpen((value) => !value)}
                aria-expanded={mobileExploreOpen}
              >
                <span>Explore</span>
                <ChevronDown
                  className={[
                    'h-4 w-4 transition',
                    mobileExploreOpen ? 'rotate-180' : 'rotate-0',
                  ].join(' ')}
                />
              </button>

              {mobileExploreOpen ? (
                <div className="grid gap-2 rounded-xl border border-white/10 bg-[#0b1226] p-2">
                  {exploreItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-emerald-200"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}

              <Link
                to="/support"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white/10"
                onClick={closeMobileMenu}
              >
                Support
              </Link>

              <div className="mt-2 grid gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="rounded-xl border border-white/10 px-4 py-3 text-center text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/10"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      className="rounded-xl bg-emerald-400 px-4 py-3 text-center font-semibold text-slate-950 shadow-md shadow-emerald-400/30 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="rounded-xl border border-white/10 px-4 py-3 text-center text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/10"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="rounded-xl bg-emerald-400 px-4 py-3 text-center font-semibold text-slate-950 shadow-md shadow-emerald-400/30 transition hover:bg-emerald-300"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
