export default function BlogCard({ blog }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 transition duration-300 hover:scale-[1.02] hover:border-emerald-300/30 hover:shadow-emerald-500/10">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex h-full flex-col gap-4 p-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-50">
            {blog.title}
          </h2>
          <p className="text-sm leading-6 text-slate-300">{blog.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-400">
          <span>{blog.author}</span>
          <span>{blog.date}</span>
        </div>
      </div>
    </article>
  )
}
