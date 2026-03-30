import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/common/Card'
import { researchArticles } from '@/data/research'

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-14 sm:py-18 lg:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Research
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
              Evidence-based insights and public health research summaries for a
              healthier Punjab.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-18 lg:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {researchArticles.map((article) => (
                <Card
                  key={article.title}
                  title={article.title}
                  description={article.description}
                  image={article.image}
                  meta={article.source}
                  actionLabel="View Research"
                  link={article.link}
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

