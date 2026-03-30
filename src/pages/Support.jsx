import { useMemo, useState } from 'react'

export default function Support() {
  const [faqOpen, setFaqOpen] = useState(0)

  const faqs = useMemo(
    () => [
      {
        q: 'How do I book or reschedule an appointment?',
        a: 'Open Appointments, choose your hospital or department, then select an available slot. You can reschedule from your appointment details screen.',
      },
      {
        q: "Why can't I find a hospital in search?",
        a: 'Check spelling, try searching by district, and confirm your filters such as department or facility type. Some facilities may be temporarily unavailable.',
      },
      {
        q: 'How do I access patient records?',
        a: 'Go to Patient Records and verify your identity. For privacy, some records may require an OTP or staff approval.',
      },
      {
        q: "I'm seeing a technical error, what should I do?",
        a: 'Refresh once, then try again. If it persists, submit a support request with a screenshot and your device or browser details.',
      },
    ],
    [],
  )

  return (
    <div className="bg-[#020617]">
      <section className="w-full border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/90">
            Support Center
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Support Center
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
            Get help with appointments, hospital search, patient records, or
            technical issues related to the Punjab Hospital Management System.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Quick Help Categories
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Appointments',
                  desc: 'Booking, rescheduling, cancellations, reminders',
                },
                {
                  title: 'Hospital Search',
                  desc: 'Facilities, departments, locations, availability',
                },
                {
                  title: 'Patient Records',
                  desc: 'Access, privacy, corrections, downloads',
                },
                {
                  title: 'Technical Issues',
                  desc: 'Login, OTP, slow loading, errors',
                },
              ].map((category) => (
                <div
                  key={category.title}
                  className="rounded-2xl border border-white/10 bg-[#0b1226] p-5"
                >
                  <p className="text-sm font-semibold text-slate-50">
                    {category.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">{category.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              System Status
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              {[
                { label: 'Website', status: 'Operational' },
                { label: 'Appointments', status: 'Operational' },
                { label: 'Patient Records', status: 'Degraded performance' },
                { label: 'Notifications (SMS/Email)', status: 'Operational' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3"
                >
                  <span className="text-slate-200">{item.label}</span>
                  <span
                    className={[
                      'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                      item.status === 'Operational'
                        ? 'bg-emerald-400/15 text-emerald-200'
                        : 'bg-amber-400/15 text-amber-200',
                    ].join(' ')}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              FAQ Section
            </h2>
            <div className="mt-5 space-y-3">
              {faqs.map((faq, idx) => {
                const open = faqOpen === idx

                return (
                  <button
                    key={faq.q}
                    type="button"
                    onClick={() => setFaqOpen(open ? -1 : idx)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1226] px-5 py-4 text-left transition hover:border-emerald-300/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-50">{faq.q}</p>
                      <span className="mt-0.5 text-slate-300">
                        {open ? '-' : '+'}
                      </span>
                    </div>
                    {open ? (
                      <p className="mt-2 text-xs leading-5 text-slate-300">
                        {faq.a}
                      </p>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Contact Support
            </h2>
            <div className="mt-5 space-y-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Phone
                </p>
                <p className="mt-1 font-semibold text-slate-50">0800-111-112</p>
                <p className="mt-1 text-xs text-slate-300">24/7 helpline</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Email
                </p>
                <p className="mt-1 font-semibold text-slate-50">
                  support@punjabhealth.gov.pk
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Typical response: 1-2 business days
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Support Request Form
            </h2>
            <form className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Full name
                <input
                  className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Email
                <input
                  type="email"
                  className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2"
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Category
                <select className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 focus:ring-2">
                  <option>Appointments</option>
                  <option>Hospital Search</option>
                  <option>Patient Records</option>
                  <option>Technical Issues</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Priority
                <select className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 focus:ring-2">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200 sm:col-span-2">
                Describe the issue
                <textarea
                  rows={5}
                  className="resize-none rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2"
                  placeholder="Include steps to reproduce, hospital name (if relevant), and any error message."
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                <p className="text-xs text-slate-300">
                  Do not include sensitive information like passwords.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-300"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              User Guides
            </h2>
            <div className="mt-5 space-y-3">
              {[
                'How to create an account',
                'How to book an appointment',
                'How to search hospitals by district',
                'Understanding patient record permissions',
              ].map((guide) => (
                <div
                  key={guide}
                  className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-200"
                >
                  {guide}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Feedback
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-5">
                <p className="text-sm font-semibold text-slate-50">
                  Report a bug
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Help us fix issues faster by sharing details and screenshots.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-5">
                <p className="text-sm font-semibold text-slate-50">
                  Suggest an improvement
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Tell us what would make the system easier for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
