import { getFirebaseDiagnostics } from '../../firebase'

const checklistItems = [
  'Email/Password sign-in method enabled in Firebase Authentication.',
  'Google provider enabled and support email selected.',
  'Phone provider enabled, test numbers configured if needed, and project billing enabled for SMS verification.',
  'Current domain added under Authentication > Settings > Authorized domains.',
]

export default function FirebaseSetupChecklist() {
  const diagnostics = getFirebaseDiagnostics()

  return (
    <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
        Firebase Console Checklist
      </h3>
      <p className="mt-2 text-sm leading-6 text-amber-50/85">
        Frontend and Firebase SDK wiring are in place. These console settings still
        need to be enabled in your Firebase project for all sign-in methods to work.
      </p>
      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-200">
          <p className="font-semibold text-slate-100">Runtime diagnostics</p>
          <p className="mt-2 text-slate-300">
            Project: {diagnostics.projectId}
          </p>
          <p className="text-slate-300">Auth domain: {diagnostics.authDomain}</p>
          <p className="text-slate-300">Current hostname: {diagnostics.hostname || 'Unknown'}</p>
          <p className="text-slate-300">Current origin: {diagnostics.origin || 'Unknown'}</p>
        </div>
        {checklistItems.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
