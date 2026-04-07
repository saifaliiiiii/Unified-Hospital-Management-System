import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { MapPinned, Sparkles, Stethoscope } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import Filters from '../components/findHospitals/Filters'
import HospitalDetailsModal from '../components/findHospitals/HospitalDetailsModal'
import Results from '../components/findHospitals/Results'
import SearchBar from '../components/findHospitals/SearchBar'
import SkeletonGrid from '../components/findHospitals/SkeletonGrid'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import hospitals, {
  hospitalLocations,
  hospitalRatingOptions,
  hospitalSortOptions,
  hospitalSpecialities,
} from '../data/hospitals'
import { findHospitals as fallbackHospitals } from '../data/findHospitals'

const INITIAL_VISIBLE_COUNT = 8

function normalizeFallbackHospital(hospital, index) {
  const location = hospital.location ?? `${hospital.district}, Punjab`
  const speciality = hospital.speciality ?? hospital.specialties?.[0] ?? 'Multi-Speciality'

  return {
    id: hospital.id ?? `fallback-${index}`,
    name: hospital.name,
    image:
      hospital.image ??
      `/images/hospitals/hospital-${(index % 4) + 1}.svg`,
    location,
    district: hospital.district ?? location.replace(', Punjab', ''),
    rating: hospital.rating ?? 4.2,
    speciality,
    type: hospital.type ?? 'Private',
    timings: hospital.timings ?? 'Open 24 Hours',
    emergency: hospital.emergency ?? false,
    specialties: hospital.specialties ?? [speciality],
    address: hospital.address ?? `${hospital.district ?? 'Punjab'} healthcare district`,
    waitTime: hospital.waitTime ?? '20 min avg wait',
    programs: hospital.programs ?? [speciality, 'Emergency Support'],
    summary:
      hospital.summary ??
      `${hospital.name} is a ${speciality.toLowerCase()} destination with responsive care access in Punjab.`,
    directionsLabel: `${hospital.name}, ${location}`,
  }
}

export default function FindHospitals() {
  const { isAuthenticated } = useAuth()
  const { likedHospitals, favoritesLoading, toggleFavorite } = useFavorites()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedSpeciality, setSelectedSpeciality] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const deferredQuery = useDeferredValue(searchQuery)

  const hospitalEntries = useMemo(() => {
    if (Array.isArray(hospitals) && hospitals.length > 0) {
      return hospitals
    }

    console.error(
      'Failed to load hospitals from extracted PDF data, falling back to mock data.',
    )

    return fallbackHospitals.map(normalizeFallbackHospital)
  }, [])

  useEffect(() => {
    const next = searchParams.get('search') ?? ''
    if (next !== searchQuery) {
      setSearchQuery(next)
    }
  }, [searchParams, searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450)
    return () => clearTimeout(timer)
  }, [])

  const activeFiltersCount = [
    selectedLocation,
    selectedSpeciality,
    selectedRating,
    sortBy !== 'rating' ? sortBy : '',
  ].filter(Boolean).length

  const filteredHospitals = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()
    const minimumRating = selectedRating ? Number(selectedRating) : 0

    const filtered = hospitalEntries.filter((hospital) => {
      const haystack = [
        hospital.name,
        hospital.location,
        hospital.speciality,
        hospital.district,
        hospital.address,
        ...(hospital.specialties ?? []),
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
      const matchesLocation =
        !selectedLocation || hospital.location === selectedLocation
      const matchesSpeciality =
        !selectedSpeciality || hospital.speciality === selectedSpeciality
      const matchesRating = !minimumRating || hospital.rating >= minimumRating

      return (
        matchesQuery &&
        matchesLocation &&
        matchesSpeciality &&
        matchesRating
      )
    })

    return filtered.sort((left, right) => {
      if (sortBy === 'alphabetical') {
        return left.name.localeCompare(right.name)
      }

      if (right.rating === left.rating) {
        return left.name.localeCompare(right.name)
      }

      return right.rating - left.rating
    })
  }, [
    deferredQuery,
    hospitalEntries,
    selectedLocation,
    selectedRating,
    selectedSpeciality,
    sortBy,
  ])

  const suggestions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return []
    }

    return hospitalEntries
      .filter((hospital) => {
        const searchable = [
          hospital.name,
          hospital.location,
          hospital.speciality,
        ]
          .join(' ')
          .toLowerCase()

        return searchable.includes(normalizedQuery)
      })
      .slice(0, 5)
  }, [hospitalEntries, searchQuery])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [deferredQuery, selectedLocation, selectedSpeciality, selectedRating, sortBy])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedLocation('')
    setSelectedSpeciality('')
    setSelectedRating('')
    setSortBy('rating')
    setVisibleCount(INITIAL_VISIBLE_COUNT)
    setSearchParams({})
  }, [setSearchParams])

  const updateSearch = useCallback(
    (value) => {
      startTransition(() => {
        setSearchQuery(value)
      })

      if (value.trim()) {
        setSearchParams({ search: value })
      } else {
        setSearchParams({})
      }
    },
    [setSearchParams],
  )

  const handleLoadMore = useCallback(() => {
    setVisibleCount((current) => current + INITIAL_VISIBLE_COUNT)
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_52%,#f8fafc_100%)] pb-14 pt-20 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.92))] px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.12)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-14 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2A7FFF] shadow-sm">
                <Sparkles className="h-4 w-4" />
                Smart hospital discovery
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Find Hospitals with richer visuals, faster filters, and instant directions.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Explore Punjab hospitals in a cleaner, more modern directory
                experience inspired by top consumer search products, while
                keeping your existing app structure intact.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Coverage
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {hospitalEntries.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Hospital listings</p>
                </div>
                <div className="rounded-[24px] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Cities
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {hospitalLocations.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Across Punjab</p>
                </div>
                <div className="rounded-[24px] bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Specialities
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {hospitalSpecialities.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Care categories</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <MapPinned className="h-5 w-5 text-sky-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Discover with confidence
                  </p>
                  <p className="text-lg font-semibold">Modern healthcare directory</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  'Live search with smart top-5 suggestions',
                  'Location, speciality, rating, and sort controls',
                  'Save favorites and open directions instantly',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3"
                  >
                    <Stethoscope className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-300" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-8">
            <SearchBar
              value={searchQuery}
              onChange={updateSearch}
              onSubmit={() => {
                if (searchQuery.trim()) {
                  setSearchParams({ search: searchQuery })
                } else {
                  setSearchParams({})
                }
              }}
              suggestions={suggestions}
              onSuggestionSelect={updateSearch}
              resultCount={filteredHospitals.length}
            />

            <Filters
              districts={hospitalLocations}
              selectedDistrict={selectedLocation}
              onDistrictChange={setSelectedLocation}
              specializations={hospitalSpecialities}
              selectedSpecialty={selectedSpeciality}
              onSpecialtyChange={setSelectedSpeciality}
              ratingOptions={hospitalRatingOptions}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              sortOptions={hospitalSortOptions}
              selectedSort={sortBy}
              onSortChange={setSortBy}
              activeFiltersCount={activeFiltersCount}
              onClear={clearFilters}
            />
          </div>
        </section>

        <section className="mt-10">
          {isLoading ? (
            <SkeletonGrid />
          ) : (
            <Results
              hospitals={filteredHospitals}
              onClear={clearFilters}
              favorites={likedHospitals}
              favoritesLoading={favoritesLoading}
              isAuthenticated={isAuthenticated}
              onToggleFavorite={(hospitalId) =>
                toggleFavorite(hospitalId, 'hospital')
              }
              onViewDetails={setSelectedHospital}
              visibleCount={visibleCount}
              onLoadMore={handleLoadMore}
            />
          )}
        </section>
      </div>

      <HospitalDetailsModal
        hospital={selectedHospital}
        isFavorite={
          selectedHospital ? likedHospitals.has(selectedHospital.id) : false
        }
        onClose={() => setSelectedHospital(null)}
        onToggleFavorite={(hospitalId) => toggleFavorite(hospitalId, 'hospital')}
      />
    </div>
  )
}
