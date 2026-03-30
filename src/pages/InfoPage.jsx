export default function InfoPage({ title, description }) {
  return (
    <div className="bg-[#020617]">
      <section className="w-full border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-14 sm:py-18 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
            {description}
          </p>
        </div>
      </section>
    </div>
  )
}
