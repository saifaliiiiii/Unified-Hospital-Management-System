import { Activity, ArrowRight, MessagesSquare, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CURANEX_PATH } from '../../utils/curaNexRoute'

export default function CuraNexCommunitySection() {
  const navigate = useNavigate()

  return (
    <section className="w-full border-t border-white/10 bg-[#020617] py-14 sm:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-sky-100/70 bg-[linear-gradient(135deg,rgba(240,249,255,0.98),rgba(236,254,255,0.95),rgba(240,253,250,0.98))] p-6 shadow-[0_20px_60px_rgba(14,116,144,0.14)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-28 w-28 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm">
                <MessagesSquare className="h-4 w-4" />
                CuraNex Community
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                CuraNex Community
              </h2>
              <p className="mt-3 max-w-2xl text-lg font-medium text-slate-700">
                A social space for doctors and patients to share experiences,
                research, and health journeys.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Explore a focused healthcare conversation stream where verified
                doctors, patients, and wellness advocates can post short
                updates, discuss case learnings, surface awareness tips, and
                support one another in real time.
              </p>
              <button
                type="button"
                onClick={() => navigate(CURANEX_PATH)}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
              >
                Explore CuraNex
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  icon: Users,
                  title: 'Shared Voices',
                  description: 'Doctors and patients contribute side by side.',
                },
                {
                  icon: Activity,
                  title: 'Health Signals',
                  description: 'Discuss awareness, emergencies, and recoveries.',
                },
                {
                  icon: MessagesSquare,
                  title: 'Short-Form Feed',
                  description: 'Post quick updates with images, comments, and saves.',
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-sky-100/70 bg-white/75 p-4 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
