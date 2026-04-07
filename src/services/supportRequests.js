import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore'
import { app } from '../firebase'

const auth = getAuth(app)
const db = getFirestore(app)

export async function submitSupportRequest(payload) {
  const currentUser = auth.currentUser

  console.log('User:', currentUser)

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

  // Keep the existing notification experience, but don't fail the support request
  // if the secondary notification write is blocked or temporarily unavailable.
  try {
    await addDoc(collection(db, 'notifications'), {
      userId: currentUser.uid,
      message: `Your support request (ID: #${requestRef.id}) has been submitted successfully. Our team will get back to you shortly.`,
      ticketId: requestRef.id,
      isRead: false,
      type: 'support_request',
      createdAt: serverTimestamp(),
    })
  } catch (notificationError) {
    console.error('Unable to create support notification:', notificationError)
  }

  return {
    ticketId: requestRef.id,
  }
}
