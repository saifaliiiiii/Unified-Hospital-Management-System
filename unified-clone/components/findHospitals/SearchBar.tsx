'use client'

import { Search, Sparkles, TrendingUp } from 'lucide-react'

import type { Hospital } from '@/lib/findHospitalsData'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  suggestions?: Hospital[]
  onSuggestionSelect?: (value: string) => void
  resultCount: number
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderHighlightedLabel(label: string, query: string) {
  if (!query.trim()) {
    return label
  }

  const pattern = new RegExp(`(${escapeRegExp(query)})`, 'ig')
  const parts = label.split(pattern)

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-amber-200/70 px-0.5 text-slate-950"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  )
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSuggestionSelect,
  resultCount,
}: SearchBarProps) {
  return (
    <form
      className="relative"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-sky-100/70 to-transparent" />
        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-inner shadow-slate-100">
              <Search className="h-5 w-5 flex-shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Search by hospital, city, or speciality"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                value={value}
                onChange={(event) => onChange(event.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-950/15">
              <TrendingUp className="h-4 w-4 text-emerald-300" />
              {resultCount} hospitals
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#2A7FFF] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#1B68E0]"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Sparkles className="h-4 w-4 text-[#2A7FFF]" />
            Top Matches
          </div>
          <div className="max-h-72 overflow-y-auto py-2">
            {suggestions.map((hospital) => (
              <button
                key={hospital.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSuggestionSelect?.(hospital.name)}
                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {renderHighlightedLabel(hospital.name, value)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {hospital.location} · {hospital.speciality}
                  </div>
                </div>
                <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700">
                  {hospital.rating}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  )
}
