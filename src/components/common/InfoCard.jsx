export default function InfoCard({ item, label, linkLabel = 'Read More' }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition duration-300 hover:scale-[1.02] hover:border-emerald-300/30 hover:shadow-emerald-500/10">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {item.tag ? (
            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
              {item.tag}
            </span>
          ) : null}
          {item.date ? (
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              {item.date}
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">
            {item.title}
          </h2>
          <p className="text-sm leading-6 text-slate-300">{item.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <span className="text-sm text-slate-400">{item[label]}</span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-400/30 transition hover:bg-emerald-300"
          >
            {linkLabel}
          </a>
        </div>
      </div>
    </article>
  )
}
