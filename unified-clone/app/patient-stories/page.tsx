import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/common/Card'
import { patientStories } from '@/data/patientStories'

export default function PatientStoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-14 sm:py-18 lg:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Patient Stories
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
              Real experiences from patients focused on care journeys, outcomes,
              and support.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-18 lg:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {patientStories.map((story) => (
                <Card
                  key={story.title}
                  title={story.title}
                  description={story.description}
                  image={story.image}
                  meta={story.author}
                  actionLabel="Read Story"
                  link={story.link}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
