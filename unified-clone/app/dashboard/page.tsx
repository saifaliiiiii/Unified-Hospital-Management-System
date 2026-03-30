'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CalendarDays, ClipboardList, HeartPulse, ShieldCheck } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/components/AuthProvider'
import { FIND_HOSPITALS_URL } from '@/lib/findHospitalRedirect'

const actions = [
  {
    title: 'Find Hospitals',
    href: FIND_HOSPITALS_URL,
    description: 'Browse hospitals, compare services, and review nearby options.',
    icon: HeartPulse,
  },
  {
    title: 'Health Tips',
    href: '/health-tips',
    description: 'Explore preventive care guidance and patient awareness content.',
    icon: ShieldCheck,
  },
  {
    title: 'Support',
    href: '/support',
    description: 'Reach support teams for portal help, care access, and follow-up.',
    icon: ClipboardList,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [authLoading, isAuthenticated, router])

  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_30%)]" />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    Patient Dashboard
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
                    Welcome, {user?.displayName || user?.phoneNumber || user?.email || 'User'}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Your authentication is active. Continue to hospitals, support,
                    and portal services from one place.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Active account
                      </p>
                      <p className="text-sm font-medium text-slate-100">
                        {user?.email || user?.phoneNumber || 'Authenticated user'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {actions.map((action) => {
                const Icon = action.icon

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-slate-950 shadow-lg shadow-emerald-500/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-slate-50">
                      {action.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {action.description}
                    </p>
                    <span className="mt-6 inline-flex text-sm font-medium text-emerald-300 transition group-hover:text-emerald-200">
                      Open section -&gt;
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
