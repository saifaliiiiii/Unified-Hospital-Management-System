'use client'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import {
  AlertTriangle,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Phone,
  Star,
  UserRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'

export default function SupportPage() {
  const faqs = useMemo(
    () => [
      {
        q: 'How do I book an appointment?',
        a: 'Go to Appointments, choose a hospital/department, then pick an available time slot and confirm.',
      },
      {
        q: 'How can I access my medical records?',
        a: 'Open Patient Records and verify your identity if prompted. Some records require additional consent for privacy.',
      },
      {
        q: 'Is my data secure?',
        a: 'Yes. We follow privacy best practices and protect sensitive information. Always keep your login credentials private.',
      },
      {
        q: 'How do I contact support?',
        a: 'Use the Contact Support options below (email, phone) or submit a request through the form.',
      },
      {
        q: 'Can I reschedule appointments?',
        a: 'Yes. Open your appointment details and choose Reschedule to select another available slot.',
      },
      {
        q: 'What should I do if I see an error?',
        a: 'Refresh once and try again. If it continues, submit a Support Request with the steps and any screenshots.',
      },
    ],
    [],
  )

  const [openFaq, setOpenFaq] = useState<number>(0)
  const [request, setRequest] = useState({
    name: '',
    email: '',
    issueType: 'Technical',
    message: '',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const next: Record<string, string> = {}
    if (!request.name.trim()) next.name = 'Name is required.'
    if (!request.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(request.email))
      next.email = 'Enter a valid email.'
    if (!request.message.trim()) next.message = 'Message is required.'
    return next
  }, [request.email, request.message, request.name])

  const showError = (key: keyof typeof request) =>
    (touched[key] || submitted) && Boolean(errors[key])

  const [rating, setRating] = useState<number>(0)
  const [feedback, setFeedback] = useState('')

  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-14 sm:py-18 lg:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Support Center
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-300 sm:text-base">
              Get help with appointments, hospital search, patient records, or
              technical issues related to the Punjab Hospital Management System.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-14">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Quick Help
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  'Appointments',
                  'Hospital Search',
                  'Patient Records',
                  'Technical Issues',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-[#0b1226] px-5 py-4 text-sm font-semibold text-slate-50 shadow-sm shadow-black/10 transition hover:border-emerald-300/30"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12 sm:pb-14">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                      Frequently Asked Questions
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                      Click a question to view the answer.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {faqs.map((faq, idx) => {
                    const open = openFaq === idx
                    return (
                      <button
                        key={faq.q}
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : idx)}
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1226] px-5 py-4 text-left shadow-sm shadow-black/10 transition hover:border-emerald-300/30"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm font-semibold text-slate-50">
                            {faq.q}
                          </p>
                          <ChevronDown
                            className={[
                              'mt-0.5 h-4 w-4 flex-none text-slate-300 transition-transform duration-200',
                              open ? 'rotate-180' : 'rotate-0',
                            ].join(' ')}
                            aria-hidden="true"
                          />
                        </div>

                        <div
                          className={[
                            'grid transition-[grid-template-rows] duration-200',
                            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                          ].join(' ')}
                        >
                          <div className="overflow-hidden">
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  System Status
                </h2>
                <div className="mt-6 space-y-3">
                  {[
                    {
                      label: 'Website',
                      state: 'operational',
                      icon: CheckCircle2,
                      chip: 'Operational',
                    },
                    {
                      label: 'Appointments',
                      state: 'operational',
                      icon: CalendarCheck,
                      chip: 'Operational',
                    },
                    {
                      label: 'Payments',
                      state: 'warning',
                      icon: AlertTriangle,
                      chip: 'Minor Issues',
                    },
                    {
                      label: 'Reports',
                      state: 'operational',
                      icon: CheckCircle2,
                      chip: 'Operational',
                    },
                  ].map((s) => {
                    const isOk = s.state === 'operational'
                    const Icon = s.icon
                    return (
                      <div
                        key={s.label}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 shadow-sm shadow-black/10"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={[
                              'h-4 w-4',
                              isOk ? 'text-emerald-300' : 'text-amber-300',
                            ].join(' ')}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-slate-200">
                            {s.label}
                          </span>
                        </div>
                        <span
                          className={[
                            'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                            isOk
                              ? 'bg-emerald-400/15 text-emerald-200'
                              : 'bg-amber-400/15 text-amber-200',
                          ].join(' ')}
                        >
                          {isOk ? '✅ ' : '⚠️ '}
                          {s.chip}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:col-span-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  Contact Support
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-5 shadow-sm shadow-black/10 transition hover:border-emerald-300/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                        <Mail className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Email
                        </p>
                        <p className="text-sm font-semibold text-slate-50">
                          support@healthcare.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-5 shadow-sm shadow-black/10 transition hover:border-emerald-300/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200">
                        <Phone className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Phone
                        </p>
                        <p className="text-sm font-semibold text-slate-50">
                          +91 98765 43210
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-5 shadow-sm shadow-black/10 transition hover:border-emerald-300/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-200">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Live Chat
                        </p>
                        <button
                          type="button"
                          className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-emerald-300/60 hover:bg-white/10"
                        >
                          Start Chat (UI)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:col-span-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  Submit a Request
                </h2>
                <form
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSubmitted(true)
                    if (Object.keys(errors).length === 0) {
                      // UI-only: keep feedback local
                      setRequest({
                        name: '',
                        email: '',
                        issueType: 'Technical',
                        message: '',
                      })
                      setTouched({})
                      setSubmitted(false)
                    }
                  }}
                >
                  <label className="grid gap-2 text-xs font-semibold text-slate-200">
                    Name
                    <input
                      value={request.name}
                      onChange={(e) =>
                        setRequest((p) => ({ ...p, name: e.target.value }))
                      }
                      onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                      className={[
                        'rounded-2xl border bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2',
                        showError('name')
                          ? 'border-rose-400/60'
                          : 'border-white/10',
                      ].join(' ')}
                      placeholder="Your name"
                    />
                    {showError('name') ? (
                      <span className="text-[11px] text-rose-200">
                        {errors.name}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2 text-xs font-semibold text-slate-200">
                    Email
                    <input
                      type="email"
                      value={request.email}
                      onChange={(e) =>
                        setRequest((p) => ({ ...p, email: e.target.value }))
                      }
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      className={[
                        'rounded-2xl border bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2',
                        showError('email')
                          ? 'border-rose-400/60'
                          : 'border-white/10',
                      ].join(' ')}
                      placeholder="you@example.com"
                    />
                    {showError('email') ? (
                      <span className="text-[11px] text-rose-200">
                        {errors.email}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2 text-xs font-semibold text-slate-200">
                    Issue Type
                    <select
                      value={request.issueType}
                      onChange={(e) =>
                        setRequest((p) => ({ ...p, issueType: e.target.value }))
                      }
                      className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 focus:ring-2"
                    >
                      <option>Technical</option>
                      <option>Billing</option>
                      <option>Appointment</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <div className="hidden sm:block" />

                  <label className="grid gap-2 text-xs font-semibold text-slate-200 sm:col-span-2">
                    Message
                    <textarea
                      rows={5}
                      value={request.message}
                      onChange={(e) =>
                        setRequest((p) => ({ ...p, message: e.target.value }))
                      }
                      onBlur={() =>
                        setTouched((p) => ({ ...p, message: true }))
                      }
                      className={[
                        'resize-none rounded-2xl border bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2',
                        showError('message')
                          ? 'border-rose-400/60'
                          : 'border-white/10',
                      ].join(' ')}
                      placeholder="Describe the issue and include any error message."
                    />
                    {showError('message') ? (
                      <span className="text-[11px] text-rose-200">
                        {errors.message}
                      </span>
                    ) : null}
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                    <p className="text-xs text-slate-300">
                      Please avoid sharing passwords or sensitive details.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-300"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  User Guides
                </h2>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: 'How to Book an Appointment',
                      desc: 'Find hospitals and select a time slot in minutes.',
                      icon: CalendarCheck,
                    },
                    {
                      title: 'How to Use Health Dashboard',
                      desc: 'Track appointments, records, and updates at a glance.',
                      icon: LayoutDashboard,
                    },
                    {
                      title: 'How to Contact Doctors',
                      desc: 'Reach departments and get care guidance quickly.',
                      icon: UserRound,
                    },
                  ].map((g) => {
                    const Icon = g.icon
                    return (
                      <div
                        key={g.title}
                        className="rounded-2xl border border-white/10 bg-[#0b1226] p-5 shadow-sm shadow-black/10 transition hover:border-emerald-300/30"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-200">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-50">
                              {g.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-300">
                              {g.desc}
                            </p>
                            <button
                              type="button"
                              className="mt-4 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-emerald-300/60 hover:bg-white/10"
                            >
                              <BookOpen
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                              />
                              Read Guide
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:col-span-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  We Value Your Feedback
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-5 shadow-sm shadow-black/10">
                    <p className="text-sm font-semibold text-slate-50">
                      Rate your experience
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      Select 1–5 stars.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const v = i + 1
                        const active = rating >= v
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setRating(v)}
                            className={[
                              'rounded-xl p-2 transition hover:bg-white/5',
                              active ? 'text-amber-300' : 'text-slate-500',
                            ].join(' ')}
                            aria-label={`Rate ${v} star${v === 1 ? '' : 's'}`}
                          >
                            <Star
                              className={[
                                'h-5 w-5',
                                active ? 'fill-amber-300' : 'fill-transparent',
                              ].join(' ')}
                            />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0b1226] p-5 shadow-sm shadow-black/10">
                    <p className="text-sm font-semibold text-slate-50">
                      Tell us more
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      What can we improve?
                    </p>
                    <input
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="mt-4 w-full rounded-2xl border border-white/10 bg-[#050b1a] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2"
                      placeholder="Short message"
                    />
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-400">
                        UI-only (no data is sent).
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setRating(0)
                          setFeedback('')
                        }}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-300"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

