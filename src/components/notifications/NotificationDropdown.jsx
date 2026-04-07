import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCheck, LogIn } from 'lucide-react'

const typeStyles = {
  system: 'bg-sky-400/10 text-sky-200 border-sky-400/20',
  doctor: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
  hospital: 'bg-violet-400/10 text-violet-200 border-violet-400/20',
  support: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
  support_request: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
}

export default function NotificationDropdown({
  isOpen,
  notifications,
  unreadCount,
  isLoading,
  error,
  isAuthenticated,
  onNotificationClick,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 top-full z-[70] mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/10 bg-[#0b1226]/95 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-slate-50">
                Notifications
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`
                  : 'You are all caught up'}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
              <CheckCheck className="h-3.5 w-3.5 text-emerald-300" />
              Live
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="border-b border-white/10 bg-white/5 px-5 py-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4 text-emerald-300" />
                Login to sync read status across your account.
              </div>
            </div>
          ) : null}

          <div className="max-h-[26rem] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="p-5 text-sm text-rose-200">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-200">
                  No notifications yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  New updates from CuraNex will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="p-3">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => onNotificationClick(notification)}
                    className={[
                      'mb-2 flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition last:mb-0',
                      notification.isRead
                        ? 'border-white/5 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05]'
                        : 'border-sky-400/15 bg-sky-400/[0.08] text-slate-100 hover:bg-sky-400/[0.12]',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'mt-0.5 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
                        typeStyles[notification.type] || typeStyles.system,
                      ].join(' ')}
                    >
                      {notification.type}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={[
                            'text-sm leading-5',
                            notification.isRead ? 'font-medium' : 'font-semibold',
                          ].join(' ')}
                        >
                          {notification.ticketId
                            ? `Ticket #${notification.ticketId}`
                            : 'Notification'}
                        </p>
                        <span className="shrink-0 text-[11px] text-slate-400">
                          {notification.relativeTime}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {notification.message}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
