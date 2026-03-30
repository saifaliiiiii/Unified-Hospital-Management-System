import { useMemo, useState } from 'react'
import FilterBar from './FilterBar'
import HeaderSection from './HeaderSection'
import HealthTipCard from './HealthTipCard'

export default function HealthTipsPage() {
  const filters = useMemo(
    () => [
      'All',
      'Sleep',
      'Diet',
      'Fitness',
      'Lifestyle',
      'Nutrition',
      'Weight Loss',
    ],
    [],
  )

  const tips = useMemo(
    () => [
      {
        id: 'sleep-1',
        category: 'Sleep',
        title: 'Improve Sleep Quality Naturally',
        description:
          'Simple, science-backed habits to fall asleep faster and wake up refreshed.',
        image:
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'diet-1',
        category: 'Diet',
        title: 'Balanced Plate for Everyday Health',
        description:
          'Build meals with the right mix of protein, fiber, and healthy fats.',
        image:
          'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'fitness-1',
        category: 'Fitness',
        title: 'Beginner-Friendly Daily Movement',
        description:
          'Low-impact routines that boost stamina without stressing joints.',
        image:
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'lifestyle-1',
        category: 'Lifestyle',
        title: 'Stress Management for Better Health',
        description:
          'Quick techniques to calm your mind and support heart health.',
        image:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'nutrition-1',
        category: 'Nutrition',
        title: 'Hydration & Electrolytes Explained',
        description:
          'Learn how water and minerals work together to keep you energized.',
        image:
          'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'weight-1',
        category: 'Weight Loss',
        title: 'Sustainable Weight Loss Strategies',
        description:
          'A realistic plan built on consistency, not extreme restrictions.',
        image:
          'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    [],
  )

  const [active, setActive] = useState('All')

  const visibleTips = useMemo(() => {
    if (active === 'All') return tips
    return tips.filter((t) => t.category === active)
  }, [active, tips])

  return (
    <div className="bg-[#020617]">
      <HeaderSection />
      <section className="pb-12 sm:pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FilterBar filters={filters} active={active} onChange={setActive} />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTips.map((tip) => (
              <HealthTipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

