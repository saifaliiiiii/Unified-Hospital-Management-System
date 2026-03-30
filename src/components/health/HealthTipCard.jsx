export default function HealthTipCard({ tip }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0b1226] shadow-sm shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/40">
      <div className="aspect-[16/10] w-full overflow-hidden bg-white/5">
        <img
          src={tip.image}
          alt={tip.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-50">{tip.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {tip.description}
        </p>
      </div>
    </article>
  )
}

