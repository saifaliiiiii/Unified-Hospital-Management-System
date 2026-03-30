export default function HeaderSection() {
  return (
    <section className="w-full border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
          Health Tips
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Prevention is Better than Cure.
        </p>
        <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
          Expert Health Tips from Industry Professionals
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-slate-300">
          Trusted advice from globally recognized doctors and nutrition experts
        </p>
      </div>
    </section>
  )
}

