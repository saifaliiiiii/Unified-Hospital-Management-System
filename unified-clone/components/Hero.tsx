'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, MapPinned, Search, ShieldPlus } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { FIND_HOSPITALS_URL } from '@/lib/findHospitalRedirect'
import { hospitalNames } from '@/lib/findHospitalsData'

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const openFindHospitals = useCallback(
    (value = '') => {
      const next = value.trim()
      router.push(
        next
          ? `${FIND_HOSPITALS_URL}?search=${encodeURIComponent(next)}`
          : FIND_HOSPITALS_URL,
      )
    },
    [router],
  )

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return []
    }

    return hospitalNames
      .filter((hospitalName) => hospitalName.toLowerCase().includes(normalizedQuery))
      .slice(0, 5)
  }, [query])

  const handleSearchInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        openFindHospitals(query)
      }
    },
    [openFindHospitals, query],
  )

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#020617] pb-16 pt-10 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="pointer-events-none absolute inset-x-0 -top-64 z-0 flex justify-center">
        <div className="h-72 w-[36rem] rounded-full bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.35),_transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div className="max-w-xl">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200"
          >
            <ShieldPlus className="h-3 w-3" />
            Punjab Hospital Portal Prototype
          </div>

          <h1
            className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl"
          >
            Unified Hospital Management Portal
          </h1>

          <p
            className="mt-4 max-w-lg text-sm text-slate-300 sm:text-base"
          >
            Connecting Punjab with Quality Healthcare Services
          </p>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href={FIND_HOSPITALS_URL}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Find Hospitals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-100 backdrop-blur-sm transition hover:border-emerald-300/80 hover:bg-white/10"
            >
              Find Doctors
            </Link>
          </div>

          <div id="coverage" className="mt-8 grid grid-cols-2 gap-4 text-xs text-slate-300 sm:text-sm">
            {[
              { value: '500+', label: 'Hospitals' },
              { value: '10,000+', label: 'Doctors' },
              { value: 'Available', label: '24/7 Support' },
              { value: '23', label: 'Districts Covered' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="text-lg font-semibold text-slate-50 sm:text-xl">
                  {item.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          <div className="relative mx-auto w-full max-w-md rounded-3xl border border-emerald-300/20 bg-slate-950/60 p-5 shadow-[0_18px_60px_rgba(16,185,129,0.35)]">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em]">
                <Search className="h-3 w-3" />
                Search
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
                Live
              </span>
            </div>

            <div
              id="search"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
            >
              <MapPinned className="h-4 w-4 text-emerald-300" />
              <div className="relative flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Search
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  placeholder="Find Hospitals"
                  className="mt-0.5 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
                {suggestions.length > 0 ? (
                  <div className="absolute left-0 top-full z-40 pt-2">
                    <div className="w-[18rem] max-w-[calc(100vw-3.25rem)] overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-lg shadow-black/40">
                      <div className="max-h-60 overflow-y-auto py-1">
                        {suggestions.map((hospitalName) => (
                          <button
                            key={hospitalName}
                            type="button"
                            className="flex w-full items-center px-4 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-emerald-200"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              setQuery(hospitalName)
                              openFindHospitals(hospitalName)
                            }}
                          >
                            {hospitalName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => openFindHospitals(query)}
                className="rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Find Hospitals
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
