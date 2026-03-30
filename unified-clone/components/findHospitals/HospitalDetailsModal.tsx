'use client'

import {
  Clock3,
  Heart,
  MapPin,
  Navigation,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react'

import type { Hospital } from '@/lib/findHospitalsData'

type HospitalDetailsModalProps = {
  hospital: Hospital | null
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: (hospitalId: string) => void
}

export function HospitalDetailsModal({
  hospital,
  isFavorite,
  onClose,
  onToggleFavorite,
}: HospitalDetailsModalProps) {
  if (!hospital) {
    return null
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    hospital.directionsLabel ?? `${hospital.name}, ${hospital.location}`,
  )}`

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/65 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="h-64 w-full object-cover sm:h-72"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/images/hospitals/hospital-1.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                Punjab Health Portal
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {hospital.name}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                  {hospital.speciality}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                  {hospital.type}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-800">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {hospital.rating}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorite(hospital.id)}
              className={[
                'inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-medium transition sm:self-auto',
                isFavorite
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20',
              ].join(' ')}
            >
              <Heart
                className={[
                  'h-4 w-4',
                  isFavorite ? 'fill-rose-500 text-rose-500' : '',
                ].join(' ')}
              />
              {isFavorite ? 'Saved' : 'Save favorite'}
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Location
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm font-medium text-slate-800">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2A7FFF]" />
                {hospital.address}
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Timings
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-800">
                <Clock3 className="h-4 w-4 text-[#2A7FFF]" />
                {hospital.timings}
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Trust marker
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                {hospital.emergency ? 'Emergency ready' : 'Scheduled care'}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Overview
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {hospital.summary}
              </p>

              <p className="mt-6 text-xs uppercase tracking-[0.18em] text-slate-500">
                Services
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {hospital.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Quick info
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Average wait
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {hospital.waitTime}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Care programs
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {hospital.programs.map((program) => (
                      <span
                        key={program}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2A7FFF] px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#1B68E0]"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
