'use client'

import { ArrowDownWideNarrow, SlidersHorizontal, X } from 'lucide-react'

import type { SelectOption } from '@/lib/findHospitalsData'

type FilterSelectProps = {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

type FiltersProps = {
  districts: string[]
  selectedDistrict: string
  onDistrictChange: (value: string) => void
  specializations: string[]
  selectedSpecialty: string
  onSpecialtyChange: (value: string) => void
  ratingOptions: SelectOption[]
  selectedRating: string
  onRatingChange: (value: string) => void
  sortOptions: SelectOption[]
  selectedSort: string
  onSortChange: (value: string) => void
  activeFiltersCount: number
  onClear: () => void
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="min-w-[180px] flex-1">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <select
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#2A7FFF] focus:ring-4 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Filters({
  districts,
  selectedDistrict,
  onDistrictChange,
  specializations,
  selectedSpecialty,
  onSpecialtyChange,
  ratingOptions,
  selectedRating,
  onRatingChange,
  sortOptions,
  selectedSort,
  onSortChange,
  activeFiltersCount,
  onClear,
}: FiltersProps) {
  return (
    <div className="mt-5 rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#2A7FFF] shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          Refine results
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <ArrowDownWideNarrow className="h-4 w-4 text-[#2A7FFF]" />
            {activeFiltersCount} filters active
          </div>
          {activeFiltersCount > 0 ? (
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          label="Location"
          value={selectedDistrict}
          onChange={onDistrictChange}
          options={[
            { value: '', label: 'All Punjab cities' },
            ...districts.map((district) => ({ value: district, label: district })),
          ]}
        />
        <FilterSelect
          label="Speciality"
          value={selectedSpecialty}
          onChange={onSpecialtyChange}
          options={[
            { value: '', label: 'All specialities' },
            ...specializations.map((specialization) => ({
              value: specialization,
              label: specialization,
            })),
          ]}
        />
        <FilterSelect
          label="Minimum rating"
          value={selectedRating}
          onChange={onRatingChange}
          options={ratingOptions}
        />
        <FilterSelect
          label="Sort results"
          value={selectedSort}
          onChange={onSortChange}
          options={sortOptions}
        />
      </div>
    </div>
  )
}
