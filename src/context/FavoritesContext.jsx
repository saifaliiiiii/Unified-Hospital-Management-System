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
  getUserFavorites,
  toggleFavorite as persistFavoriteToggle,
} from '../services/userFavorites'

const FavoritesContext = createContext(null)

function createFavoriteSets() {
  return {
    likedDoctors: new Set(),
    likedHospitals: new Set(),
  }
}

function toSets(favorites) {
  return {
    likedDoctors: new Set(favorites.likedDoctors),
    likedHospitals: new Set(favorites.likedHospitals),
  }
}

function cloneFavoriteSets(current) {
  return {
    likedDoctors: new Set(current.likedDoctors),
    likedHospitals: new Set(current.likedHospitals),
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

function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function FavoritesProvider({ children }) {
  const { user, authLoading } = useAuth()
  const [favorites, setFavorites] = useState(createFavoriteSets)
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const timeoutRef = useRef(null)

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

  useEffect(() => {
    let isActive = true

    if (authLoading) {
      return undefined
    }

    if (!user?.uid) {
      setFavorites(createFavoriteSets())
      setFavoritesLoading(false)
      return undefined
    }

    setFavoritesLoading(true)

    getUserFavorites(user.uid)
      .then((nextFavorites) => {
        if (!isActive) {
          return
        }

        setFavorites(toSets(nextFavorites))
      })
      .catch((error) => {
        console.error('Unable to fetch user favorites:', error)

        if (!isActive) {
          return
        }

        setFavorites(createFavoriteSets())
        showToast('Unable to load favorites right now.')
      })
      .finally(() => {
        if (isActive) {
          setFavoritesLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [authLoading, user?.uid])

  const toggleFavorite = useCallback(async (itemId, type) => {
    if (!user?.uid) {
      showToast('Please login to save favorites')
      return { ok: false, requiresAuth: true }
    }

    const bucket = getFavoriteBucket(type)
    const wasLiked = favorites[bucket].has(itemId)

    setFavorites((current) => {
      const next = cloneFavoriteSets(current)

      if (next[bucket].has(itemId)) {
        next[bucket].delete(itemId)
      } else {
        next[bucket].add(itemId)
      }

      return next
    })

    try {
      const isLiked = await persistFavoriteToggle(user.uid, itemId, type, wasLiked)
      showToast(
        isLiked ? 'Added to favorites' : 'Removed from favorites',
      )
      return { ok: true, isLiked }
    } catch (error) {
      console.error('Unable to update favorites:', error)

      setFavorites((current) => {
        const reverted = cloneFavoriteSets(current)

        if (wasLiked) {
          reverted[bucket].add(itemId)
        } else {
          reverted[bucket].delete(itemId)
        }

        return reverted
      })

      showToast('Unable to save favorites right now.')
      return { ok: false, error }
    }
  }, [favorites, showToast, user?.uid])

  const value = useMemo(
    () => ({
      favorites,
      favoritesLoading,
      likedDoctors: favorites.likedDoctors,
      likedHospitals: favorites.likedHospitals,
      toggleFavorite,
      showToast,
    }),
    [favorites, favoritesLoading, showToast, toggleFavorite],
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
