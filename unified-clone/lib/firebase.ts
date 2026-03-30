import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD9gklIbTG7RWmi1ddFSPuV9D0ZtkM-wwc',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'unified-hospital-managem-1df36.firebaseapp.com',
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unified-hospital-managem-1df36',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'unified-hospital-managem-1df36.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '985140068697',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:985140068697:web:4fd4d4f45c32a0ca720c48',
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
