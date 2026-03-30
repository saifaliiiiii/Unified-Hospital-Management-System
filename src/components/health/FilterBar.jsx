export default function FilterBar({ filters, active, onChange }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {filters.map((label) => {
        const isActive = label === active
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            className={[
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
              isActive
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/40'
                : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-emerald-200',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

