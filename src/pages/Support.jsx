import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { submitSupportRequest } from '../services/supportRequests'

const initialFormState = {
  name: '',
  email: '',
  category: 'Appointments',
  priority: 'Normal',
  issue: '',
}

function validateSupportForm(formData) {
  const nextErrors = {}

  if (!formData.name.trim()) {
    nextErrors.name = 'Full name is required.'
  }

  if (!formData.email.trim()) {
    nextErrors.email = 'Email is required.'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    nextErrors.email = 'Please enter a valid email address.'
  }

  if (!formData.category.trim()) {
    nextErrors.category = 'Please select a category.'
  }

  if (!formData.priority.trim()) {
    nextErrors.priority = 'Please select a priority.'
  }

  if (!formData.issue.trim()) {
    nextErrors.issue = 'Issue description is required.'
  }

  return nextErrors
}

export default function Support() {
  const { user, isAuthenticated, authLoading } = useAuth()
  const [faqOpen, setFaqOpen] = useState(0)
  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [submitToast, setSubmitToast] = useState('')

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

  useEffect(() => {
    if (!user) {
      setFormData((current) => ({
        ...current,
        name: '',
        email: '',
      }))
      return
    }

    setFormData((current) => ({
      ...current,
      name: current.name || user.displayName || '',
      email: current.email || user.email || '',
    }))
  }, [user])

  useEffect(() => {
    if (!submitToast) {
      return undefined
    }

    const timer = setTimeout(() => setSubmitToast(''), 2600)
    return () => clearTimeout(timer)
  }, [submitToast])

  const handleInputChange = (field) => (event) => {
    const value = event.target.value

    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    setFormErrors((current) => ({
      ...current,
      [field]: '',
    }))

    setSubmitError('')
    setSubmitSuccess('')
    setTicketId('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      setSubmitSuccess('')
      setTicketId('')
      setSubmitToast('')
      setSubmitError('Please login to submit a support request.')
      return
    }

    const validationErrors = validateSupportForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      setSubmitSuccess('')
      setTicketId('')
      setSubmitToast('')
      setSubmitError('Please complete all required fields.')
      return
    }

    setIsSubmitting(true)
    setFormErrors({})
    setSubmitError('')
    setSubmitSuccess('')
    setTicketId('')

    try {
      // Submit the support request only after validation succeeds.
      const result = await submitSupportRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category.trim(),
        priority: formData.priority.trim(),
        issue: formData.issue.trim(),
      })

      setFormData(initialFormState)
      setSubmitSuccess('Your support request has been submitted successfully.')
      setTicketId(result.ticketId)
      setSubmitToast(
        `Support request submitted successfully (Ticket ID: ${result.ticketId})`,
      )
    } catch (error) {
      console.error('Support request submission failed:', error)
      setSubmitToast('')
      setSubmitError(
        error.message === 'Please login to submit a support request.'
          ? error.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#020617]">
      <AnimatePresence>
        {submitToast ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed right-4 top-20 z-[75] hidden w-96 rounded-2xl border border-emerald-400/20 bg-slate-950/95 px-4 py-3 text-sm text-emerald-100 shadow-2xl shadow-slate-950/40 backdrop-blur md:block"
          >
            {submitToast}
          </motion.div>
        ) : null}
      </AnimatePresence>

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
            {!authLoading && !isAuthenticated ? (
              <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                Please login to submit a support request.
              </div>
            ) : null}
            {submitError ? (
              <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {submitError}
              </div>
            ) : null}
            {submitSuccess ? (
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                <p>{submitSuccess}</p>
                {ticketId ? (
                  <p className="mt-1 text-xs text-emerald-200">
                    Ticket ID: <span className="font-semibold">{ticketId}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Full name
                <input
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2"
                  placeholder="Your name"
                />
                {formErrors.name ? (
                  <span className="text-[11px] font-medium text-rose-300">
                    {formErrors.name}
                  </span>
                ) : null}
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2"
                  placeholder="you@example.com"
                />
                {formErrors.email ? (
                  <span className="text-[11px] font-medium text-rose-300">
                    {formErrors.email}
                  </span>
                ) : null}
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Category
                <select
                  value={formData.category}
                  onChange={handleInputChange('category')}
                  className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 focus:ring-2"
                >
                  <option value="Appointments">Appointments</option>
                  <option value="Hospital Search">Hospital Search</option>
                  <option value="Patient Records">Patient Records</option>
                  <option value="Technical Issues">Technical Issues</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.category ? (
                  <span className="text-[11px] font-medium text-rose-300">
                    {formErrors.category}
                  </span>
                ) : null}
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200">
                Priority
                <select
                  value={formData.priority}
                  onChange={handleInputChange('priority')}
                  className="rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 focus:ring-2"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                {formErrors.priority ? (
                  <span className="text-[11px] font-medium text-rose-300">
                    {formErrors.priority}
                  </span>
                ) : null}
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-200 sm:col-span-2">
                Describe the issue
                <textarea
                  rows={5}
                  value={formData.issue}
                  onChange={handleInputChange('issue')}
                  className="resize-none rounded-2xl border border-white/10 bg-[#0b1226] px-4 py-3 text-sm text-slate-100 outline-none ring-emerald-400/40 placeholder:text-slate-500 focus:ring-2"
                  placeholder="Include steps to reproduce, hospital name (if relevant), and any error message."
                />
                {formErrors.issue ? (
                  <span className="text-[11px] font-medium text-rose-300">
                    {formErrors.issue}
                  </span>
                ) : null}
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                <p className="text-xs text-slate-300">
                  Do not include sensitive information like passwords.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !isAuthenticated}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-500/60 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
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
