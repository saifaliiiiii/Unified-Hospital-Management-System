import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useAuth } from './AuthContext'
import {
  addFavoriteDoctor,
  addFavoriteHospital,
  removeFavoriteDoctor,
  removeFavoriteHospital,
  subscribeFavoriteDoctors,
  subscribeFavoriteHospitals,
} from '../services/userFavorites'

const FavoritesContext = createContext(null)

function createFavoriteKey(itemId, type) {
  return `${type}:${itemId}`
}

function createFavoriteSets() {
  return {
    likedDoctors: new Set(),
    likedHospitals: new Set(),
    favoriteDoctors: [],
    favoriteHospitals: [],
  }
}

function cloneFavoriteSets(current) {
  return {
    likedDoctors: new Set(current.likedDoctors),
    likedHospitals: new Set(current.likedHospitals),
    favoriteDoctors: Array.isArray(current.favoriteDoctors)
      ? [...current.favoriteDoctors]
      : [],
    favoriteHospitals: Array.isArray(current.favoriteHospitals)
      ? [...current.favoriteHospitals]
      : [],
  }
}

function getFavoriteBucket(type) {
  if (type === 'doctor') {
    return 'likedDoctors'
  }

  if (type === 'hospital') {
    return 'likedHospitals'
  }

  throw new Error(`Unsupported favorite type: ${type}`)
}

function mergeFavoritesToState(current, { doctors = null, hospitals = null } = {}) {
  const next = cloneFavoriteSets(current)

  if (doctors) {
    next.favoriteDoctors = doctors
    next.likedDoctors = new Set(doctors.map((favorite) => favorite.id))
  }

  if (hospitals) {
    next.favoriteHospitals = hospitals
    next.likedHospitals = new Set(hospitals.map((favorite) => favorite.id))
  }

  return next
}

function Toast({ toast }) {
  const MotionDiv = motion.div

  return (
    <AnimatePresence>
      {toast ? (
        <MotionDiv
          className="fixed right-4 top-20 z-[80] max-w-sm rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.18 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/15 text-rose-300">
              <Heart className="h-4 w-4" />
            </div>
            <p>{toast.message}</p>
          </div>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  )
}

export function FavoritesProvider({ children }) {
  const { user, authLoading } = useAuth()
  const [favorites, setFavorites] = useState(createFavoriteSets)
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const [pendingKeys, setPendingKeys] = useState(() => new Set())
  const [toast, setToast] = useState(null)
  const timeoutRef = useRef(null)
  const pendingKeysRef = useRef(new Set())

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const showToast = useCallback((message) => {
    setToast({ message })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null)
    }, 2400)
  }, [])

  const addPendingKey = useCallback((pendingKey) => {
    pendingKeysRef.current.add(pendingKey)
    setPendingKeys((current) => {
      const next = new Set(current)
      next.add(pendingKey)
      return next
    })
  }, [])

  const removePendingKey = useCallback((pendingKey) => {
    pendingKeysRef.current.delete(pendingKey)
    setPendingKeys((current) => {
      const next = new Set(current)
      next.delete(pendingKey)
      return next
    })
  }, [])

  useEffect(() => {
    if (authLoading) {
      return undefined
    }

    if (!user?.uid) {
      setFavorites(createFavoriteSets())
      pendingKeysRef.current.clear()
      setPendingKeys(new Set())
      setFavoritesLoading(false)
      return undefined
    }

    setFavoritesLoading(true)

    let doctorReady = false
    let hospitalReady = false

    const completeIfReady = () => {
      if (doctorReady && hospitalReady) {
        setFavoritesLoading(false)
      }
    }

    let unsubscribeDoctors = () => {}
    let unsubscribeHospitals = () => {}

    try {
      unsubscribeDoctors = subscribeFavoriteDoctors(user.uid, {
        onNext: (favoriteDoctors) => {
          doctorReady = true
          setFavorites((current) =>
            mergeFavoritesToState(current, { doctors: favoriteDoctors }),
          )
          completeIfReady()
        },
        onError: (error) => {
          doctorReady = true
          void error
          showToast('Unable to load favorites right now.')
          setFavorites((current) => mergeFavoritesToState(current, { doctors: [] }))
          completeIfReady()
        },
      })
    } catch (error) {
      doctorReady = true
      void error
      setFavorites((current) => mergeFavoritesToState(current, { doctors: [] }))
      completeIfReady()
    }

    try {
      unsubscribeHospitals = subscribeFavoriteHospitals(user.uid, {
        onNext: (favoriteHospitals) => {
          hospitalReady = true
          setFavorites((current) =>
            mergeFavoritesToState(current, { hospitals: favoriteHospitals }),
          )
          completeIfReady()
        },
        onError: (error) => {
          hospitalReady = true
          void error
          showToast('Unable to load favorites right now.')
          setFavorites((current) => mergeFavoritesToState(current, { hospitals: [] }))
          completeIfReady()
        },
      })
    } catch (error) {
      hospitalReady = true
      void error
      setFavorites((current) => mergeFavoritesToState(current, { hospitals: [] }))
      completeIfReady()
    }

    return () => {
      unsubscribeDoctors()
      unsubscribeHospitals()
    }
  }, [authLoading, showToast, user?.uid])

  const toggleFavorite = useCallback(async (item, type) => {
    if (!user?.uid) {
      showToast('Please login to save favorites')
      return { ok: false, requiresAuth: true }
    }

    const bucket = getFavoriteBucket(type)
    const itemId = String(
      typeof item === 'string'
        ? item
        : item?.id ?? item?.doctorId ?? item?.hospitalId ?? '',
    )

    if (!itemId) {
      showToast('Unable to save this favorite.')
      return { ok: false }
    }

    const pendingKey = createFavoriteKey(itemId, type)

    if (pendingKeysRef.current.has(pendingKey)) {
      return { ok: false, ignored: true }
    }

    const wasLiked = favorites[bucket].has(itemId)

    addPendingKey(pendingKey)

    setFavorites((current) => {
      const next = cloneFavoriteSets(current)

      if (next[bucket].has(itemId)) {
        next[bucket].delete(itemId)
      } else {
        next[bucket].add(itemId)
      }

      if (type === 'doctor') {
        if (wasLiked) {
          next.favoriteDoctors = next.favoriteDoctors.filter(
            (favorite) => favorite.id !== String(itemId),
          )
        } else if (typeof item === 'object' && item) {
          next.favoriteDoctors = [
            {
              id: itemId,
              doctorId: itemId,
              name: item.name,
              image: item.image || '',
              specialization: item.specialization,
              location: item.location || item.city || item.district,
              rating: item.rating ?? null,
            },
            ...next.favoriteDoctors,
          ]
        }
      }

      if (type === 'hospital') {
        if (wasLiked) {
          next.favoriteHospitals = next.favoriteHospitals.filter(
            (favorite) => favorite.id !== String(itemId),
          )
        } else if (typeof item === 'object' && item) {
          next.favoriteHospitals = [
            {
              id: itemId,
              hospitalId: itemId,
              name: item.name,
              image: item.image,
              category: item.category || item.speciality || item.type,
              speciality: item.category || item.speciality || item.type,
              location: item.location || item.district,
              rating: item.rating,
            },
            ...next.favoriteHospitals,
          ]
        }
      }

      return next
    })

    try {
      if (type === 'doctor') {
        if (wasLiked) {
          await removeFavoriteDoctor(user.uid, itemId)
        } else if (typeof item === 'object' && item) {
          await addFavoriteDoctor(user.uid, item)
        } else {
          throw new Error('Missing doctor details for saving favorite.')
        }
      }

      if (type === 'hospital') {
        if (wasLiked) {
          await removeFavoriteHospital(user.uid, itemId)
        } else if (typeof item === 'object' && item) {
          await addFavoriteHospital(user.uid, item)
        } else {
          throw new Error('Missing hospital details for saving favorite.')
        }
      }

      const isLiked = !wasLiked
      showToast(
        isLiked ? 'Added to favorites' : 'Removed from favorites',
      )
      return { ok: true, isLiked }
    } catch (error) {
      setFavorites((current) => {
        const reverted = cloneFavoriteSets(current)

        if (wasLiked) {
          reverted[bucket].add(itemId)
        } else {
          reverted[bucket].delete(itemId)
        }

        if (type === 'doctor') {
          if (wasLiked && typeof item === 'object' && item) {
            const exists = reverted.favoriteDoctors.some(
              (favorite) => favorite.id === itemId,
            )

            if (!exists) {
              reverted.favoriteDoctors = [
                {
                  id: itemId,
                  doctorId: itemId,
                  name: item.name,
                  image: item.image || '',
                  specialization: item.specialization,
                  location: item.location || item.city || item.district,
                  rating: item.rating ?? null,
                },
                ...reverted.favoriteDoctors,
              ]
            }
          } else {
            reverted.favoriteDoctors = reverted.favoriteDoctors.filter(
              (favorite) => favorite.id !== itemId,
            )
          }
        }

        if (type === 'hospital') {
          if (wasLiked && typeof item === 'object' && item) {
            const exists = reverted.favoriteHospitals.some(
              (favorite) => favorite.id === itemId,
            )

            if (!exists) {
              const category = item.category || item.speciality || item.type
              reverted.favoriteHospitals = [
                {
                  id: itemId,
                  hospitalId: itemId,
                  name: item.name,
                  image: item.image,
                  category,
                  speciality: category,
                  location: item.location || item.district,
                  rating: item.rating,
                },
                ...reverted.favoriteHospitals,
              ]
            }
          } else {
            reverted.favoriteHospitals = reverted.favoriteHospitals.filter(
              (favorite) => favorite.id !== itemId,
            )
          }
        }

        return reverted
      })

      showToast('Unable to save favorites right now.')
      return { ok: false, error }
    } finally {
      removePendingKey(pendingKey)
    }
  }, [addPendingKey, favorites, removePendingKey, showToast, user?.uid])

  const isFavoritePending = useCallback(
    (itemId, type) => pendingKeys.has(createFavoriteKey(itemId, type)),
    [pendingKeys],
  )

  const value = useMemo(
    () => ({
      favorites,
      favoritesLoading,
      likedDoctors: favorites.likedDoctors,
      likedHospitals: favorites.likedHospitals,
      favoriteDoctors: favorites.favoriteDoctors,
      favoriteHospitals: favorites.favoriteHospitals,
      toggleFavorite,
      isFavoritePending,
      showToast,
    }),
    [favorites, favoritesLoading, isFavoritePending, showToast, toggleFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <Toast toast={toast} />
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider.')
  }

  return context
}
