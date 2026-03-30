export default function AuthShell({
  badge,
  title,
  description,
  accent = 'emerald',
  asideTitle,
  asideDescription,
  asidePoints,
  children,
}) {
  const accentStyles = {
    emerald: {
      badge:
        'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
      glow:
        'bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_32%)]',
      panel:
        'shadow-emerald-950/30',
      bullet:
        'from-emerald-400 to-sky-500',
    },
    sky: {
      badge:
        'border-sky-400/25 bg-sky-400/10 text-sky-300',
      glow:
        'bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.18),_transparent_35%)]',
      panel:
        'shadow-sky-950/30',
      bullet:
        'from-sky-400 to-emerald-400',
    },
  }

  const palette = accentStyles[accent] || accentStyles.emerald

  return (
    <section className="relative min-h-[calc(100vh-145px)] overflow-hidden bg-[#020617] px-4 py-10 sm:px-6 lg:px-8">
      <div className={`absolute inset-0 ${palette.glow}`} />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur sm:p-8">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${palette.badge}`}
          >
            {badge}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            {description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {asidePoints.map((point) => (
              <div
                key={point}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div
                  className={`h-2 w-14 rounded-full bg-gradient-to-r ${palette.bullet}`}
                />
                <p className="mt-4 text-sm leading-6 text-slate-300">{point}</p>
              </div>
            ))}
          </div>

          <div className={`mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl ${palette.panel}`}>
            <h2 className="text-xl font-semibold text-slate-50">{asideTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              {asideDescription}
            </p>
          </div>
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </section>
  )
}
