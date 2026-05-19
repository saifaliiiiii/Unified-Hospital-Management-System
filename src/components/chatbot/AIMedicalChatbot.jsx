import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Bot,
  HeartPulse,
  Loader2,
  MessageCircleHeart,
  Minus,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { sendChatMessage } from '../../services/chatApi'

const MotionDiv = motion.div
const MotionButton = motion.button

const quickSuggestions = [
  'Check Symptoms',
  'Find Specialist',
  'Diet Advice',
  'Medicine Information',
]

const emergencyPattern =
  /\b(chest pain|breathing difficulty|shortness of breath|stroke|suicidal|suicide|heart attack|seizure|unconscious|heavy bleeding|severe allergic|anaphylaxis)\b/i

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hello, I am Cura AI. I can help explain symptoms, suggest the right type of doctor, and share general health guidance.',
    createdAt: new Date().toISOString(),
  },
]

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sky-700 shadow-sm ring-1 ring-sky-100">
      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-500" />
      <span className="ml-1 text-xs font-medium">Cura AI is typing</span>
    </div>
  )
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm',
          isUser
            ? 'rounded-br-md bg-sky-600 text-white'
            : message.isEmergency
              ? 'rounded-bl-md border border-rose-200 bg-rose-50 text-rose-950'
              : 'rounded-bl-md bg-white text-slate-700 ring-1 ring-sky-100',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={[
            'mt-2 text-[11px]',
            isUser ? 'text-sky-100' : message.isEmergency ? 'text-rose-500' : 'text-slate-400',
          ].join(' ')}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}

export default function AIMedicalChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const apiMessages = useMemo(
    () =>
      messages
        .filter((message) => ['user', 'assistant'].includes(message.role) && !message.isLocalOnly)
        .map(({ role, content }) => ({ role, content })),
    [messages],
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [isOpen])

  const addAssistantMessage = (content, options = {}) => {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
        createdAt: new Date().toISOString(),
        ...options,
      },
    ])
  }

  const handleSubmit = async (event, suggestion) => {
    event?.preventDefault()
    const content = (suggestion || input).trim()

    if (!content || isLoading) {
      return
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }

    setMessages((current) => [...current, userMessage])
    setInput('')
    setError('')

    if (emergencyPattern.test(content)) {
      addAssistantMessage(
        'This may be an emergency. Please contact local emergency services immediately or visit the nearest hospital emergency department now.',
        { isEmergency: true, isLocalOnly: true },
      )
      return
    }

    setIsLoading(true)

    try {
      const data = await sendChatMessage([...apiMessages, userMessage])
      addAssistantMessage(data.reply)
    } catch (chatError) {
      setError(chatError.message)
      addAssistantMessage(
        `${chatError.message} If this is urgent, please contact a doctor or emergency services.`,
        { isLocalOnly: true },
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <MotionDiv
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-4 flex h-[min(680px,calc(100vh-7rem))] w-[calc(100vw-2.5rem)] max-w-[420px] flex-col overflow-hidden rounded-[1.5rem] border border-white/70 bg-sky-50/95 shadow-2xl shadow-sky-950/25 backdrop-blur-xl"
            role="dialog"
            aria-label="AI medical assistant chat"
          >
            <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-emerald-500 px-5 py-4 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/30">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold">Cura AI Assistant</h2>
                      <Sparkles className="h-4 w-4 text-emerald-100" />
                    </div>
                    <p className="text-xs text-sky-100">Medical support for portal patients</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22"
                    aria-label="Minimize chat"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-sky-100 bg-white/80 px-5 py-3 text-xs leading-5 text-slate-600">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <span>
                  This AI provides informational support only and is not a substitute for
                  professional medical advice.
                </span>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
              aria-live="polite"
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading ? <TypingIndicator /> : null}
            </div>

            <div className="border-t border-sky-100 bg-white/90 px-4 py-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={(event) => handleSubmit(event, suggestion)}
                    disabled={isLoading}
                    className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {error ? (
                <div className="mb-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about symptoms or care guidance..."
                  className="min-w-0 flex-1 rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/25 transition hover:-translate-y-0.5 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>
          </MotionDiv>
        ) : null}
      </AnimatePresence>

      <MotionButton
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ y: -3, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white shadow-2xl shadow-sky-950/30 backdrop-blur-xl transition"
        aria-label="Open AI medical assistant"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500 via-sky-600 to-emerald-400 opacity-95 transition group-hover:opacity-100" />
        <span className="absolute -inset-1 rounded-full bg-sky-400/30 blur opacity-70 transition group-hover:opacity-100" />
        <HeartPulse className="relative h-8 w-8" />
        <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-400">
          <MessageCircleHeart className="h-3 w-3 text-sky-950" />
        </span>
      </MotionButton>
    </div>
  )
}
