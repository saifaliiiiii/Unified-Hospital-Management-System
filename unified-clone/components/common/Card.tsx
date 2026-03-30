type CardProps = {
  title: string
  description: string
  image: string
  meta: string
  actionLabel: string
  link: string
}

export function Card({
  title,
  description,
  image,
  meta,
  actionLabel,
  link,
}: CardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-slate-950/10 transition duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-950/20">
      <img
        src={image}
        alt={title}
        className="h-52 w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">
            {title}
          </h2>
          <p className="text-sm leading-6 text-slate-300">{description}</p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {meta}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          {actionLabel}
        </a>
      </div>
    </article>
  )
}
