import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

export async function submitSupportRequest(payload) {
  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error('Please login to submit a support request.')
  }

  const trimmedPayload = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    category: payload.category.trim(),
    issue: payload.issue.trim(),
    priority: payload.priority?.trim() || '',
  }

  // Store the support request first so the user gets a reliable ticket ID.
  const requestRef = await addDoc(collection(db, 'support_requests'), {
    userId: currentUser.uid,
    name: trimmedPayload.name,
    email: trimmedPayload.email,
    issue: trimmedPayload.issue,
    category: trimmedPayload.category,
    status: 'pending',
    createdAt: serverTimestamp(),
    ...(trimmedPayload.priority ? { priority: trimmedPayload.priority } : {}),
  })

  const notificationPayload = {
    userId: currentUser.uid,
    message: `Your support request (ID: #${requestRef.id}) has been submitted successfully. Our team will get back to you shortly.`,
    ticketId: requestRef.id,
    isRead: false,
    type: 'support_request',
    createdAt: serverTimestamp(),
  }

  await addDoc(
    collection(db, 'userNotifications', currentUser.uid, 'notifications'),
    notificationPayload,
  )

  await addDoc(collection(db, 'notifications'), notificationPayload)

  return {
    ticketId: requestRef.id,
  }
}
