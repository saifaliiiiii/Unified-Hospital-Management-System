import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, Stethoscope } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import DoctorCard from '../components/findDoctors/DoctorCard'
import SearchBar from '../components/findDoctors/SearchBar'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import doctorsData, {
  doctorLocations,
  doctorSpecializations,
} from '../data/doctorsData'

const INITIAL_VISIBLE_COUNT = 12

export default function FindDoctors() {
  const { isAuthenticated } = useAuth()
  const { likedDoctors, favoritesLoading, toggleFavorite } = useFavorites()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '')
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    searchParams.get('specialization') ?? '',
  )
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get('location') ?? '',
  )
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [isLoading, setIsLoading] = useState(true)
  const deferredQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    const nextSearch = searchParams.get('search') ?? ''
    const nextSpecialization = searchParams.get('specialization') ?? ''
    const nextLocation = searchParams.get('location') ?? ''

    if (nextSearch !== searchQuery) {
      setSearchQuery(nextSearch)
    }

    if (nextSpecialization !== selectedSpecialization) {
      setSelectedSpecialization(nextSpecialization)
    }

    if (nextLocation !== selectedLocation) {
      setSelectedLocation(nextLocation)
    }
  }, [searchParams, searchQuery, selectedLocation, selectedSpecialization])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [deferredQuery, selectedLocation, selectedSpecialization])

  const syncSearchParams = ({
    nextSearch = searchQuery,
    nextSpecialization = selectedSpecialization,
    nextLocation = selectedLocation,
  } = {}) => {
    const nextParams = {}

    if (nextSearch.trim()) {
      nextParams.search = nextSearch
    }

    if (nextSpecialization) {
      nextParams.specialization = nextSpecialization
    }

    if (nextLocation) {
      nextParams.location = nextLocation
    }

    setSearchParams(nextParams)
  }

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return doctorsData.filter((doctor) => {
      const matchesQuery =
        !normalizedQuery ||
        doctor.name.toLowerCase().includes(normalizedQuery)
      const matchesSpecialization =
        !selectedSpecialization ||
        doctor.specialization.toLowerCase() ===
          selectedSpecialization.toLowerCase()
      const normalizedSelectedLocation = selectedLocation.toLowerCase()
      const matchesLocation =
        !selectedLocation ||
        [doctor.city, doctor.district, doctor.state, doctor.location]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSelectedLocation))

      return matchesQuery && matchesSpecialization && matchesLocation
    })
  }, [deferredQuery, selectedLocation, selectedSpecialization])

  const displayedDoctors = useMemo(
    () => filteredDoctors.slice(0, visibleCount),
    [filteredDoctors, visibleCount],
  )

  const cityCount = useMemo(
    () => new Set(doctorsData.map((doctor) => doctor.city).filter(Boolean)).size,
    [],
  )

  const clearFilters = () => {
    setSelectedSpecialization('')
    setSelectedLocation('')
    startTransition(() => {
      setSearchQuery('')
    })
    syncSearchParams({
      nextSearch: '',
      nextSpecialization: '',
      nextLocation: '',
    })
  }

  const handleSearchChange = (value) => {
    startTransition(() => {
      setSearchQuery(value)
    })

    syncSearchParams({ nextSearch: value })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.22),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_48%,#f8fafc_100%)] pb-14 pt-20 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.12)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" />

          <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2A7FFF] shadow-sm">
                <Sparkles className="h-4 w-4" />
                Doctor discovery
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Find doctors faster with live search, smart filtering, and a cleaner directory.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Browse the doctor records extracted from your Punjab dataset and
                narrow results instantly by name, specialization, or location.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Doctors
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {doctorsData.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Unique profiles</p>
                </div>
                <div className="rounded-[24px] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Specializations
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {doctorSpecializations.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Filter options</p>
                </div>
                <div className="rounded-[24px] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Cities
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {cityCount}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Dataset coverage</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Stethoscope className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Built from your dataset
                  </p>
                  <p className="text-lg font-semibold">Real doctor directory</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  'Real-time search across the Punjab doctor directory',
                  'Case-insensitive specialization and location filtering',
                  'Graceful empty state when no doctors match',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3"
                  >
                    <Search className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-8 space-y-5">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              resultCount={filteredDoctors.length}
            />

            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <label className="block md:min-w-[260px]">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Filter By Specialization
                  </span>
                  <select
                    value={selectedSpecialization}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      setSelectedSpecialization(nextValue)
                      syncSearchParams({ nextSpecialization: nextValue })
                    }}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#2A7FFF] focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">All specializations</option>
                    {doctorSpecializations.map((specialization) => (
                      <option key={specialization} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block md:min-w-[240px]">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Filter By Location
                  </span>
                  <select
                    value={selectedLocation}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      setSelectedLocation(nextValue)
                      syncSearchParams({ nextLocation: nextValue })
                    }}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#2A7FFF] focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">All cities in Punjab</option>
                    {doctorLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {selectedSpecialization || selectedLocation
                      ? [selectedSpecialization, selectedLocation]
                          .filter(Boolean)
                          .join(' • ')
                      : 'All categories'}
                  </div>
                  {(searchQuery || selectedSpecialization || selectedLocation) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[320px] animate-pulse rounded-[30px] border border-slate-200 bg-white/70"
                />
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                No doctors found
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-600">
                Try a broader doctor name, switch specialization, or change the
                city filter to explore more matches.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#2A7FFF] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#1B68E0]"
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Search results
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {filteredDoctors.length} doctor matches
                  </h2>
                </div>
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  {favoritesLoading
                    ? 'Loading favorites...'
                    : isAuthenticated
                      ? `${likedDoctors.size} liked doctors`
                      : 'Login to save favorites'}
                </div>
              </div>

              <motion.div
                layout
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {displayedDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    isFavorite={likedDoctors.has(doctor.id)}
                    onToggleFavorite={(doctorId) =>
                      toggleFavorite(doctorId, 'doctor')
                    }
                  />
                ))}
              </motion.div>

              {visibleCount < filteredDoctors.length ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((current) => current + INITIAL_VISIBLE_COUNT)
                    }
                    className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Load more doctors
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
