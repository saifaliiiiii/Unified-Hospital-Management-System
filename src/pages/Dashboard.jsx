import { Link } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardList,
  Heart,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import DoctorCard from '../components/findDoctors/DoctorCard'
import hospitals from '../data/hospitals'
import doctorsData from '../data/doctorsData'
import { FIND_HOSPITALS_PATH } from '../utils/findHospitalRoute'

const quickActions = [
  {
    title: 'Find Hospitals',
    description: 'Browse verified hospitals and compare nearby options quickly.',
    to: FIND_HOSPITALS_PATH,
    icon: HeartPulse,
  },
  {
    title: 'Health Tips',
    description: 'Read curated wellness guidance and preventive care resources.',
    to: '/health-tips',
    icon: ShieldCheck,
  },
  {
    title: 'Support',
    description: 'Reach the support team for portal and service assistance.',
    to: '/support',
    icon: ClipboardList,
  },
  {
    title: 'Favorites',
    description: 'Open the doctors and hospitals you have liked.',
    to: '/dashboard#favorites',
    icon: Heart,
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { likedDoctors, likedHospitals, favoritesLoading, toggleFavorite } =
    useFavorites()

  const favoriteDoctors = doctorsData.filter((doctor) => likedDoctors.has(doctor.id))
  const favoriteHospitals = hospitals.filter((hospital) =>
    likedHospitals.has(hospital.id),
  )

  return (
    <section className="relative min-h-[calc(100vh-145px)] overflow-hidden bg-[#020617] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Dashboard
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
                Welcome back, {user?.displayName || user?.email || 'Patient'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Welcome to your health dashboard. Here you can manage your
                profile, explore hospitals, access health resources, and stay
                updated with your medical journey.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-slate-100">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={action.title}
                to={action.to}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-slate-950 shadow-lg shadow-emerald-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-50">
                  {action.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {action.description}
                </p>
                <span className="mt-6 inline-flex text-sm font-medium text-emerald-300 transition group-hover:text-emerald-200">
                  Open section -&gt;
                </span>
              </Link>
            )
          })}
        </div>

        <div
          id="favorites"
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">
                Favorites
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">
                Your liked doctors and hospitals
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Everything you save from the doctor and hospital directories is
                collected here for quick access.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Heart className="h-4 w-4 text-rose-400" />
              {likedDoctors.size + likedHospitals.size} total favorites
            </div>
          </div>

          {favoritesLoading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : favoriteDoctors.length === 0 && favoriteHospitals.length === 0 ? (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 px-6 py-14 text-center">
              <Heart className="mx-auto h-10 w-10 text-rose-300" />
              <h3 className="mt-4 text-2xl font-semibold text-slate-50">
                No favorites yet
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
                Save doctors or hospitals with the heart button and they will
                appear here automatically.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Doctors
                    </p>
                    <h3 className="text-xl font-semibold text-slate-50">
                      {favoriteDoctors.length} liked doctors
                    </h3>
                  </div>
                </div>

                {favoriteDoctors.length === 0 ? (
                  <p className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-400">
                    No liked doctors yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {favoriteDoctors.map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        isFavorite={likedDoctors.has(doctor.id)}
                        onToggleFavorite={(doctorId) =>
                          toggleFavorite(doctorId, 'doctor')
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Hospitals
                    </p>
                    <h3 className="text-xl font-semibold text-slate-50">
                      {favoriteHospitals.length} liked hospitals
                    </h3>
                  </div>
                </div>

                {favoriteHospitals.length === 0 ? (
                  <p className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-400">
                    No liked hospitals yet.
                  </p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {favoriteHospitals.map((hospital) => (
                      <div
                        key={hospital.id}
                        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold text-slate-50">
                              {hospital.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {hospital.speciality}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFavorite(hospital.id, 'hospital')}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-rose-400 transition hover:scale-105 hover:bg-white/10"
                            aria-label="Remove favorite hospital"
                          >
                            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                          </button>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                              Location
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-200">
                              {hospital.location}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                              Rating
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-200">
                              {hospital.rating}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <Link
                            to={FIND_HOSPITALS_PATH}
                            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                          >
                            Explore hospitals
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
