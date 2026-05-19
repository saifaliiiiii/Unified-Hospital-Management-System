import { useCallback, useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

function toDateValue(timestamp) {
  if (!timestamp) {
    return null
  }

  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate()
  }

  const parsedDate = new Date(timestamp)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function formatRelativeTime(timestamp) {
  const date = toDateValue(timestamp)

  if (!date) {
    return 'Just now'
  }

  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const absoluteSeconds = Math.abs(diffInSeconds)

  if (absoluteSeconds < 60) {
    return formatter.format(diffInSeconds, 'second')
  }

  const diffInMinutes = Math.round(diffInSeconds / 60)
  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, 'minute')
  }

  const diffInHours = Math.round(diffInMinutes / 60)
  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, 'hour')
  }

  return formatter.format(Math.round(diffInHours / 24), 'day')
}

function normalizeNotification(snapshot) {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    userId: data.userId || '',
    message: data.message || 'You have a new notification.',
    ticketId: data.ticketId || '',
    type: data.type || 'system',
    isRead: Boolean(data.isRead),
    createdAt: data.createdAt || null,
    relativeTime: formatRelativeTime(data.createdAt),
  }
}

export function useNotifications() {
  const { user, isAuthenticated, authLoading } = useAuth()
  const userId = user?.uid || ''
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [toastNotification, setToastNotification] = useState(null)
  const previousIdsRef = useRef([])
  const toastTimeoutRef = useRef(null)

  const clearToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (authLoading) {
      return undefined
    }

    if (!isAuthenticated || !userId) {
      const timer = setTimeout(() => {
        setNotifications([])
        setUnreadCount(0)
        setIsLoading(false)
        setError('')
        previousIdsRef.current = []
      }, 0)

      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setIsLoading(true)
      setError('')
    }, 0)

    const notificationsQuery = query(
      collection(db, 'userNotifications', userId, 'notifications'),
      orderBy('createdAt', 'desc'),
    )

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        clearTimeout(timer)
        const nextNotifications = snapshot.docs.map(normalizeNotification)
        const currentIds = nextNotifications.map((notification) => notification.id)
        const previousIds = previousIdsRef.current

        if (previousIds.length > 0) {
          const newestNotification = nextNotifications.find(
            (notification) => !previousIds.includes(notification.id),
          )

          if (newestNotification) {
            setToastNotification(newestNotification)
            clearToast()
            toastTimeoutRef.current = setTimeout(() => {
              setToastNotification(null)
              toastTimeoutRef.current = null
            }, 2500)
          }
        }

        previousIdsRef.current = currentIds
        setNotifications(nextNotifications)
        setUnreadCount(nextNotifications.filter((item) => !item.isRead).length)
        setIsLoading(false)
      },
      (snapshotError) => {
        clearTimeout(timer)
        void snapshotError
        setError('Unable to load notifications right now.')
        setIsLoading(false)
      },
    )

    return () => {
      clearTimeout(timer)
      unsubscribe()
      clearToast()
    }
  }, [authLoading, clearToast, isAuthenticated, userId])

  const markAsRead = useCallback(async (notificationId) => {
    if (!userId || !notificationId) {
      return undefined
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    )
    setUnreadCount((current) => Math.max(0, current - 1))

    try {
      await updateDoc(doc(db, 'userNotifications', userId, 'notifications', notificationId), {
        isRead: true,
      })
    } catch (markError) {
      void markError

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: false }
            : notification,
        ),
      )
      setUnreadCount((current) => current + 1)
    }
  }, [userId])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    toastNotification,
    markAsRead,
    isAuthenticated,
  }
}

export default useNotifications
