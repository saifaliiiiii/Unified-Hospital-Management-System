import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

const feedbacksCollection = collection(db, 'feedbacks')

export async function submitFeedback({ rating, feedback, isAnonymous = false }) {
  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error('Please login to submit feedback.')
  }

  const cleanFeedback = feedback.trim()

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Please choose a rating from 1 to 5.')
  }

  if (cleanFeedback.length < 5) {
    throw new Error('Feedback must be at least 5 characters.')
  }

  return addDoc(feedbacksCollection, {
    uid: currentUser.uid,
    userName: isAnonymous
      ? 'Anonymous'
      : currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
    email: currentUser.email || '',
    rating,
    feedback: cleanFeedback.slice(0, 500),
    isAnonymous,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToLatestFeedbacks(onNext, onError) {
  const latestFeedbackQuery = query(
    feedbacksCollection,
    orderBy('createdAt', 'desc'),
    limit(12),
  )

  return onSnapshot(
    latestFeedbackQuery,
    (snapshot) => {
      onNext(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      )
    },
    onError,
  )
}
