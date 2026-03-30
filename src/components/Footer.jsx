export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020617] py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          <span className="font-medium text-slate-200">
            Unified Health Portal
          </span>{' '}
          - UI-only clone.
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em]">
          (c) {new Date().getFullYear()} Punjab Health Department
        </p>
      </div>
    </footer>
  )
}
