import { memo, useMemo } from 'react'
import {
  BriefcaseMedical,
  CalendarDays,
  Heart,
  MapPin,
  Phone,
  Stethoscope,
} from 'lucide-react'
import { motion } from 'framer-motion'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function DoctorCard({ doctor, isFavorite, onToggleFavorite }) {
  const initials = useMemo(() => getInitials(doctor.name), [doctor.name])
  const contactHref = doctor.contact ? `tel:${doctor.contact}` : null
  const bookingHref = doctor.bookingLink || contactHref

  return (
    <motion.article
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      className="group overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_28px_65px_rgba(15,23,42,0.14)]"
    >
      <div className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(135deg,#dbeafe_0%,#ecfeff_42%,#f0fdf4_100%)] p-5">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-300/20 blur-2xl" />
        <button
          type="button"
          onClick={() => onToggleFavorite(doctor.id)}
          className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
          aria-label={isFavorite ? 'Remove favorite doctor' : 'Save doctor'}
        >
          <Heart
            className={[
              'h-4 w-4 transition-all duration-200',
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400',
            ].join(' ')}
          />
        </button>

        <div className="relative flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white shadow-lg shadow-slate-900/15">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2A7FFF]">
              {doctor.specialization}
            </p>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-slate-950 transition-colors group-hover:text-[#2A7FFF]">
              {doctor.name}
            </h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <BriefcaseMedical className="h-4 w-4 text-emerald-500" />
              {doctor.hospital}
            </p>
            {doctor.qualification ? (
              <p className="mt-2 text-sm text-slate-500">{doctor.qualification}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Location
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800">
              <MapPin className="h-4 w-4 text-[#2A7FFF]" />
              {doctor.location || doctor.city || 'Punjab'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Experience
            </p>
            <p className="mt-2 text-sm font-medium text-slate-800">
              {doctor.experience || 'Not available in dataset'}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Contact
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Phone className="h-4 w-4 text-emerald-600" />
              {doctor.contact || 'Not available in dataset'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Role
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Stethoscope className="h-4 w-4 text-[#2A7FFF]" />
              {doctor.role || 'Doctor'}
            </p>
          </div>
        </div>

        <div className="pt-1">
          {bookingHref ? (
            <a
              href={bookingHref}
              target={doctor.bookingLink ? '_blank' : undefined}
              rel={doctor.bookingLink ? 'noreferrer' : undefined}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2A7FFF] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#1B68E0]"
            >
              <CalendarDays className="h-4 w-4" />
              {doctor.bookingLink ? 'Book Appointment' : 'Call Now'}
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400"
            >
              <CalendarDays className="h-4 w-4" />
              Booking unavailable
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default memo(DoctorCard)
