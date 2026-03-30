import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/common/Card'

const healthTips = [
  {
    title: 'Stay Hydrated Throughout the Day',
    description: 'Consistent hydration supports circulation, digestion, temperature balance, and overall energy levels.',
    meta: 'Prevention and Wellness',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.who.int/news-room/fact-sheets/detail/drinking-water',
  },
  {
    title: 'Prioritize Sleep for Recovery',
    description: 'Quality sleep improves immune function, focus, mood regulation, and long-term metabolic health.',
    meta: 'Rest and Recovery',
    image:
      'https://images.unsplash.com/photo-1511296265581-c2450046447d?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.who.int/news-room/questions-and-answers/item/sleep',
  },
  {
    title: 'Choose Balanced Daily Meals',
    description: 'Nutritious meals with vegetables, protein, fiber, and healthy fats help maintain steady health outcomes.',
    meta: 'Nutrition Guidance',
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.who.int/health-topics/healthy-diet',
  },
]

export default function HealthTipsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-14 sm:py-18 lg:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Health Tips
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
              Your Health, Our Responsibility.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-18 lg:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {healthTips.map((tip) => (
                <Card
                  key={tip.title}
                  title={tip.title}
                  description={tip.description}
                  image={tip.image}
                  meta={tip.meta}
                  actionLabel="Read More"
                  link={tip.link}
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

