import { Star } from 'lucide-react'

export default function StarRating({
  value,
  onChange,
  hoveredValue,
  onHover,
  readOnly = false,
  size = 'md',
  label = 'Select rating',
}) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-7 w-7'
  const activeValue = hoveredValue || value

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((rating) => {
        const active = rating <= activeValue

        return (
          <button
            key={rating}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(rating)}
            onMouseEnter={() => onHover?.(rating)}
            onMouseLeave={() => onHover?.(0)}
            onFocus={() => onHover?.(rating)}
            onBlur={() => onHover?.(0)}
            className={[
              'rounded-full p-1 transition focus:outline-none focus:ring-2 focus:ring-emerald-300/70',
              readOnly ? 'cursor-default' : 'hover:-translate-y-0.5',
              active ? 'text-amber-300' : 'text-slate-500',
            ].join(' ')}
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} out of 5 stars`}
          >
            <Star
              className={[
                iconSize,
                'drop-shadow-sm transition',
                active ? 'fill-amber-300' : 'fill-transparent',
              ].join(' ')}
            />
          </button>
        )
      })}
    </div>
  )
}
