import { Footer } from '@/components/Footer'
import { Features } from '@/components/Features'
import { Hero } from '@/components/Hero'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { FIND_HOSPITALS_URL } from '@/lib/findHospitalRedirect'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />

        <section
          id="support"
          className="border-t border-white/10 bg-[#020617] py-14 sm:py-18 lg:py-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  Ready to Get Started?
                </h2>
                <p className="mt-3 max-w-lg text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                  Join thousands of patients who trust Punjab Health Portal for
                  their healthcare needs
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={FIND_HOSPITALS_URL}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-300"
                >
                  Find Hospitals
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-emerald-300/80 hover:bg-white/10"
                >
                  Find Doctors
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
