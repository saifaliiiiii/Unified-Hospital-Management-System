import { CalendarCheck2, CreditCard, FileText, UserRoundPlus } from 'lucide-react'

const features = [
  {
    icon: UserRoundPlus,
    title: 'Find Hospital Details',
    description:
      'Easily search and view detailed information about hospitals, including facilities, location, and available services.',
  },
  {
    icon: CalendarCheck2,
    title: 'Find Doctor Details',
    description:
      'Browse and explore doctor profiles, including specialization, experience, and availability.',
  },
  {
    icon: FileText,
    title: '24/7 Customer Support',
    description:
      'Get round-the-clock assistance for any queries, appointments, or emergency support.',
  },
]

export default function Features() {
  return (
    <section id="services" className="w-full bg-[#020617] py-14 sm:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-slate-50 sm:text-3xl">
          Our Services
        </h2>
        <p className="mt-3 text-center text-base text-slate-300">
          Comprehensive healthcare solutions at your fingertips
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-5"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
