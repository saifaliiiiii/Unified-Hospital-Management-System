import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const USER_FAVORITES_COLLECTION = 'userFavorites'

const FAVORITE_FIELD_MAP = {
  doctor: 'likedDoctors',
  hospital: 'likedHospitals',
}

export const EMPTY_USER_FAVORITES = {
  likedDoctors: [],
  likedHospitals: [],
}

function getFavoriteField(type) {
  const field = FAVORITE_FIELD_MAP[type]

  if (!field) {
    throw new Error(`Unsupported favorite type: ${type}`)
  }

  return field
}

export async function getUserFavorites(userId) {
  if (!userId) {
    return EMPTY_USER_FAVORITES
  }

  const snapshot = await getDoc(doc(db, USER_FAVORITES_COLLECTION, userId))

  if (!snapshot.exists()) {
    return EMPTY_USER_FAVORITES
  }

  const data = snapshot.data()

  return {
    likedDoctors: Array.isArray(data.likedDoctors) ? data.likedDoctors : [],
    likedHospitals: Array.isArray(data.likedHospitals) ? data.likedHospitals : [],
  }
}

export async function toggleFavorite(userId, itemId, type, isCurrentlyLiked) {
  if (!userId) {
    throw new Error('A logged-in user is required to save favorites.')
  }

  const field = getFavoriteField(type)

  await setDoc(
    doc(db, USER_FAVORITES_COLLECTION, userId),
    {
      [field]: isCurrentlyLiked ? arrayRemove(itemId) : arrayUnion(itemId),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return !isCurrentlyLiked
}
