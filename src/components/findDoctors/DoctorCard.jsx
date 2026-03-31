import { memo, useMemo } from 'react'
import { BriefcaseMedical, MapPin, Star, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function DoctorCard({ doctor }) {
  const initials = useMemo(() => getInitials(doctor.name), [doctor.name])

  return (
    <motion.article
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      className="group overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_28px_65px_rgba(15,23,42,0.14)]"
    >
      <div className="relative overflow-hidden border-b border-slate-100 bg-[linear-gradient(135deg,#dbeafe_0%,#ecfeff_42%,#f0fdf4_100%)] p-5">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-300/20 blur-2xl" />
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
              {doctor.city || 'Punjab'}
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
              Rating
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {doctor.rating ? `${doctor.rating}/5` : 'Not rated yet'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Consultation Fee
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Wallet className="h-4 w-4 text-emerald-600" />
              {doctor.consultationFee
                ? `Rs. ${doctor.consultationFee}`
                : 'Not listed'}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default memo(DoctorCard)
