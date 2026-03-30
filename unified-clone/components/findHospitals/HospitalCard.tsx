'use client'

import { memo, useMemo } from 'react'
import { Heart, MapPin, Navigation, ShieldCheck, Star } from 'lucide-react'

import type { Hospital } from '@/lib/findHospitalsData'

type HospitalCardProps = {
  hospital: Hospital
  isFavorite: boolean
  onToggleFavorite: (hospitalId: string) => void
  onViewDetails: (hospital: Hospital) => void
}

function HospitalCardComponent({
  hospital,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
}: HospitalCardProps) {
  const mapsUrl = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        hospital.directionsLabel ?? `${hospital.name}, ${hospital.location}`,
      )}`,
    [hospital.directionsLabel, hospital.location, hospital.name],
  )

  return (
    <article className="group overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(15,23,42,0.14)]">
      <div className="relative overflow-hidden">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = '/images/hospitals/hospital-1.svg'
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-md backdrop-blur">
            {hospital.type}
          </span>
          {hospital.emergency ? (
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              24/7 Emergency
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(hospital.id)}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur transition hover:bg-white"
          aria-label={isFavorite ? 'Remove favorite hospital' : 'Save hospital'}
        >
          <Heart
            className={[
              'h-4 w-4 transition',
              isFavorite ? 'fill-rose-500 text-rose-500' : '',
            ].join(' ')}
          />
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="rounded-2xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur">
            {hospital.waitTime}
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700 shadow-lg">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {hospital.rating}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-tight text-slate-900 transition-colors group-hover:text-[#2A7FFF]">
            {hospital.name}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-500">{hospital.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Location
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm font-medium text-slate-800">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2A7FFF]" />
              <span className="line-clamp-1">{hospital.location}</span>
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Speciality
            </p>
            <p className="mt-2 text-sm font-medium text-slate-800">
              {hospital.speciality}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {hospital.programs.map((program) => (
            <span
              key={program}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
            >
              {program}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Availability
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {hospital.timings}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Verified
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => onViewDetails(hospital)}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#2A7FFF] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#1B68E0]"
          >
            View Details
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
        </div>
      </div>
    </article>
  )
}

export const HospitalCard = memo(HospitalCardComponent)
