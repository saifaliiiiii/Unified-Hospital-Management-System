import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
  inMemoryPersistence,
  setPersistence,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD9gklIbTG7RWmi1ddFSPuV9D0ZtkM-wwc',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'unified-hospital-managem-1df36.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || 'unified-hospital-managem-1df36',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'unified-hospital-managem-1df36.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '985140068697',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:985140068697:web:4fd4d4f45c32a0ca720c48',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-RMGY18SX2E',
}

const app = initializeApp(firebaseConfig)

function createAuthInstance() {
  try {
    return initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    })
  } catch (error) {
    void error
    return getAuth(app)
  }
}

const auth = createAuthInstance()
const db = getFirestore(app)

let persistencePromise = null

async function setBestEffortPersistence() {
  const candidates = [
    { persistence: browserLocalPersistence, label: 'browserLocalPersistence' },
    { persistence: indexedDBLocalPersistence, label: 'indexedDBLocalPersistence' },
    { persistence: inMemoryPersistence, label: 'inMemoryPersistence' },
  ]

  for (const candidate of candidates) {
    try {
      await setPersistence(auth, candidate.persistence)
      return candidate.label
    } catch (error) {
      void error
    }
  }

  return 'unknown'
}

export function ensureAuthPersistence() {
  if (!persistencePromise) {
    persistencePromise = Promise.race([
      setBestEffortPersistence(),
      new Promise((resolve) => {
        setTimeout(() => resolve('timeout'), 2500)
      }),
    ])
  }

  return persistencePromise
}

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId']
const missingConfigKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key])

void missingConfigKeys

auth.useDeviceLanguage()

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const providerMap = {
  google: googleProvider,
  github: new GithubAuthProvider(),
  facebook: new FacebookAuthProvider(),
}

function getFirebaseDiagnostics() {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    appId: firebaseConfig.appId,
    apiKeyPreview: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.slice(0, 6)}...` : null,
    hostname: typeof window !== 'undefined' ? window.location.hostname : null,
    origin: typeof window !== 'undefined' ? window.location.origin : null,
  }
}

export {
  app,
  auth,
  db,
  getFirebaseDiagnostics,
  googleProvider,
  providerMap,
}
