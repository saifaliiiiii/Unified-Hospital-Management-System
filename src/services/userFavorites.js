import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const FAVORITES_COLLECTION = 'favorites'
const DOCTORS_DOCUMENT = 'doctors'
const HOSPITALS_DOCUMENT = 'hospitals'
const FAVORITE_ITEMS_COLLECTION = 'items'

function requireUserId(userId) {
  if (!userId) {
    throw new Error('A logged-in user is required to access favorites.')
  }
}

function getFavoritesCollectionRef(userId, type) {
  requireUserId(userId)

  if (type !== DOCTORS_DOCUMENT && type !== HOSPITALS_DOCUMENT) {
    throw new Error(`Unsupported favorite type: ${type}`)
  }

  return collection(
    db,
    'users',
    userId,
    FAVORITES_COLLECTION,
    type,
    FAVORITE_ITEMS_COLLECTION,
  )
}

function getFavoriteDocRef(userId, type, itemId) {
  requireUserId(userId)

  if (type !== DOCTORS_DOCUMENT && type !== HOSPITALS_DOCUMENT) {
    throw new Error(`Unsupported favorite type: ${type}`)
  }

  return doc(
    db,
    'users',
    userId,
    FAVORITES_COLLECTION,
    type,
    FAVORITE_ITEMS_COLLECTION,
    String(itemId),
  )
}

function getFavoriteDoctorsCollectionRef(userId) {
  return getFavoritesCollectionRef(userId, DOCTORS_DOCUMENT)
}

function getFavoriteHospitalsCollectionRef(userId) {
  return getFavoritesCollectionRef(userId, HOSPITALS_DOCUMENT)
}

function getFavoriteDoctorDocRef(userId, doctorId) {
  return getFavoriteDocRef(userId, DOCTORS_DOCUMENT, doctorId)
}

function getFavoriteHospitalDocRef(userId, hospitalId) {
  return getFavoriteDocRef(userId, HOSPITALS_DOCUMENT, hospitalId)
}

function normalizeFavoritePayload(payload) {
  const cleaned = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  )

  return cleaned
}

function mapDoctorFavoriteDoc(docSnap) {
  const data = docSnap.data()

  return {
    ...data,
    id: data.doctorId ?? data.id ?? docSnap.id,
    doctorId: data.doctorId ?? data.id ?? docSnap.id,
  }
}

function mapHospitalFavoriteDoc(docSnap) {
  const data = docSnap.data()

  return {
    ...data,
    id: data.id ?? docSnap.id,
    speciality: data.category ?? data.speciality,
  }
}

export function subscribeFavoriteDoctors(userId, { onNext, onError } = {}) {
  const ref = getFavoriteDoctorsCollectionRef(userId)
  const favoritesQuery = query(ref, orderBy('createdAt', 'desc'))

  return onSnapshot(
    favoritesQuery,
    (snapshot) => {
      if (!onNext) {
        return
      }

      const favorites = snapshot.docs.map(mapDoctorFavoriteDoc)

      onNext(favorites)
    },
    (error) => {
      if (onError) {
        onError(error)
      }
    },
  )
}

export function subscribeFavoriteHospitals(userId, { onNext, onError } = {}) {
  const ref = getFavoriteHospitalsCollectionRef(userId)
  const favoritesQuery = query(ref, orderBy('createdAt', 'desc'))

  return onSnapshot(
    favoritesQuery,
    (snapshot) => {
      if (!onNext) {
        return
      }

      const favorites = snapshot.docs.map(mapHospitalFavoriteDoc)

      onNext(favorites)
    },
    (error) => {
      if (onError) {
        onError(error)
      }
    },
  )
}

export async function getFavoriteDoctors(userId) {
  const ref = getFavoriteDoctorsCollectionRef(userId)
  const snapshot = await getDocs(query(ref, orderBy('createdAt', 'desc')))
  return snapshot.docs.map(mapDoctorFavoriteDoc)
}

export async function getFavoriteHospitals(userId) {
  const ref = getFavoriteHospitalsCollectionRef(userId)
  const snapshot = await getDocs(query(ref, orderBy('createdAt', 'desc')))
  return snapshot.docs.map(mapHospitalFavoriteDoc)
}

export async function isDoctorFavorited(userId, doctorId) {
  const snapshot = await getDoc(getFavoriteDoctorDocRef(userId, doctorId))
  return snapshot.exists()
}

export async function isHospitalFavorited(userId, hospitalId) {
  const snapshot = await getDoc(getFavoriteHospitalDocRef(userId, hospitalId))
  return snapshot.exists()
}

export async function addFavoriteDoctor(userId, doctor) {
  const favoriteId = String(doctor.id ?? doctor.doctorId)

  const payload = normalizeFavoritePayload({
    id: favoriteId,
    doctorId: favoriteId,
    name: doctor.name,
    image: doctor.image || '',
    specialization: doctor.specialization,
    location: doctor.location || doctor.city || doctor.district,
    rating: doctor.rating ?? null,
    createdAt: serverTimestamp(),
  })

  await setDoc(getFavoriteDoctorDocRef(userId, favoriteId), payload, { merge: true })
  return payload
}

export async function removeFavoriteDoctor(userId, doctorId) {
  await deleteDoc(getFavoriteDoctorDocRef(userId, doctorId))
}

export async function addFavoriteHospital(userId, hospital) {
  const favoriteId = String(hospital.id ?? hospital.hospitalId)

  const payload = normalizeFavoritePayload({
    id: favoriteId,
    name: hospital.name,
    image: hospital.image,
    category: hospital.category || hospital.speciality || hospital.type,
    location: hospital.location || hospital.district,
    rating: hospital.rating,
    createdAt: serverTimestamp(),
  })

  await setDoc(getFavoriteHospitalDocRef(userId, favoriteId), payload, { merge: true })
  return payload
}

export async function removeFavoriteHospital(userId, hospitalId) {
  await deleteDoc(getFavoriteHospitalDocRef(userId, hospitalId))
}
