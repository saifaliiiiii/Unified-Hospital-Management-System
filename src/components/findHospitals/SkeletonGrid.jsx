export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-48 animate-pulse bg-slate-200" />
          <div className="space-y-4 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="flex gap-2">
              <div className="h-9 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="h-9 w-32 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
