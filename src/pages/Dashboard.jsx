import { Link } from 'react-router-dom'
import { CalendarDays, ClipboardList, HeartPulse, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { FIND_HOSPITALS_PATH } from '../utils/findHospitalRoute'

const quickActions = [
  {
    title: 'Find Hospitals',
    description: 'Browse verified hospitals and compare nearby options quickly.',
    to: FIND_HOSPITALS_PATH,
    icon: HeartPulse,
  },
  {
    title: 'Health Tips',
    description: 'Read curated wellness guidance and preventive care resources.',
    to: '/health-tips',
    icon: ShieldCheck,
  },
  {
    title: 'Support',
    description: 'Reach the support team for portal and service assistance.',
    to: '/support',
    icon: ClipboardList,
  },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <section className="relative min-h-[calc(100vh-145px)] overflow-hidden bg-[#020617] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Dashboard
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
                Welcome back, {user?.displayName || user?.email || 'Patient'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Welcome to your health dashboard. Here you can manage your
                profile, explore hospitals, access health resources, and stay
                updated with your medical journey.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-slate-100">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={action.title}
                to={action.to}
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
  )
}
