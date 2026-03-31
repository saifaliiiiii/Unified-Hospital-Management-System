import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-inner shadow-slate-100">
          <Search className="h-5 w-5 flex-shrink-0 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search by doctor name, specialization, or hospital"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Clear doctor search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-950/15">
          {resultCount} doctors
        </div>
      </div>
    </div>
  )
}
