import { memo } from 'react'
import { Heart, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import HospitalCard from './HospitalCard'

function Results({
  hospitals,
  onClear,
  favorites,
  favoritesLoading,
  isAuthenticated,
  onToggleFavorite,
  onViewDetails,
  visibleCount,
  onLoadMore,
}) {
  if (hospitals.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <Search className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="mb-2 text-2xl font-semibold text-slate-900">
          No hospitals found
        </h3>
        <p className="mx-auto mb-5 max-w-md text-slate-600">
          Try a different city, relax one of the filters, or search for a more
          general speciality.
        </p>
        <button
          data-testid="clear-all-filters-btn"
          type="button"
          onClick={onClear}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#2A7FFF] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#1B68E0]"
        >
          Reset search
        </button>
      </div>
    )
  }

  const visibleHospitals = hospitals.slice(0, visibleCount)
  const hasMore = visibleCount < hospitals.length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Available now</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {hospitals.length} curated hospital matches
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <Heart className="h-4 w-4 text-rose-500" />
          {favoritesLoading
            ? 'Loading favorites...'
            : isAuthenticated
              ? `${favorites.size} saved`
              : 'Login to save'}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4"
      >
        {visibleHospitals.map((hospital, index) => (
          <HospitalCard
            key={hospital.id ?? `${hospital.name}-${index}`}
            hospital={hospital}
            isFavorite={favorites.has(hospital.id)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
          />
        ))}
      </motion.div>

      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Load more hospitals
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default memo(Results)
