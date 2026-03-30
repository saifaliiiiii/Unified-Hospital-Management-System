import InfoCard from '../components/common/InfoCard'
import research from '../data/research'

export default function Research() {
  return (
    <div className="bg-[#020617]">
      <section className="w-full border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-14 sm:py-18 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
            Explore
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Medical Research
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
            Explore evidence-based articles, public health findings, and
            trusted research sources shaping modern healthcare.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300/80">
              Research Highlights
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
              Trusted Insights and Medical Developments
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {research.map((item) => (
              <InfoCard key={item.id} item={item} label="source" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
