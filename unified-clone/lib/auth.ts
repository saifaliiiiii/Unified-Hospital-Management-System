'use client'

import {
  ConfirmationResult,
  RecaptchaVerifier,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

type ProfileData = {
  fullName?: string
}

let recaptchaVerifier: RecaptchaVerifier | null = null
let confirmationResult: ConfirmationResult | null = null

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/user-not-found': 'No account was found for this email address.',
  'auth/wrong-password': 'Wrong password. Please try again.',
  'auth/missing-password': 'Please enter your password.',
  'auth/weak-password': 'Weak password. Use at least 6 characters.',
  'auth/popup-blocked': 'Popup blocked. Please allow popups and try again.',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/operation-not-allowed':
    'This sign-in method is disabled. Enable it in Firebase Console.',
  'auth/unauthorized-domain':
    'This domain is not authorized. Add localhost or your live domain in Firebase Console.',
  'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
  'auth/missing-phone-number': 'Phone number is required.',
  'auth/code-expired': 'The OTP has expired. Please request a new code.',
  'auth/invalid-verification-code': 'Incorrect OTP. Please try again.',
  'auth/missing-verification-code': 'Please enter the OTP you received.',
}

function getFriendlyAuthError(error: unknown) {
  const code =
    typeof error === 'object' && error && 'code' in error
      ? String((error as { code?: string }).code)
      : ''

  return AUTH_ERROR_MESSAGES[code] || 'Something went wrong. Please try again.'
}

async function applyProfile(user: User, profile: ProfileData = {}) {
  if (!profile.fullName?.trim()) {
    return
  }

  await updateProfile(user, { displayName: profile.fullName.trim() })
}

export async function configurePersistence() {
  if (typeof window === 'undefined') {
    return
  }

  await setPersistence(auth, browserLocalPersistence)
}

export async function signup(email: string, password: string, profile: ProfileData = {}) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await applyProfile(credential.user, profile)

    return {
      user: credential.user,
      message: 'Account created successfully.',
    }
  } catch (error) {
    console.error('[auth] signup:error', error)
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function login(email: string, password: string) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)

    return {
      user: credential.user,
      message: 'Logged in successfully.',
    }
  } catch (error) {
    console.error('[auth] login:error', error)
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function loginWithGoogle(profile: ProfileData = {}) {
  try {
    const credential = await signInWithPopup(auth, googleProvider)
    await applyProfile(credential.user, profile)

    return {
      user: credential.user,
      message: 'Signed in with Google successfully.',
    }
  } catch (error) {
    console.error('[auth] google:error', error)
    throw new Error(getFriendlyAuthError(error))
  }
}

function getRecaptchaVerifier(containerId: string) {
  if (typeof window === 'undefined') {
    throw new Error('Phone authentication is only available in the browser.')
  }

  if (recaptchaVerifier) {
    return recaptchaVerifier
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  })

  return recaptchaVerifier
}

export async function sendOTP(phoneNumber: string, containerId = 'recaptcha-container') {
  try {
    const verifier = getRecaptchaVerifier(containerId)
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier)

    return {
      message: 'OTP sent successfully.',
    }
  } catch (error) {
    console.error('[auth] phone:error', error)

    if (recaptchaVerifier) {
      recaptchaVerifier.clear()
      recaptchaVerifier = null
    }

    throw new Error(getFriendlyAuthError(error))
  }
}

export async function verifyOTP(code: string, profile: ProfileData = {}) {
  if (!confirmationResult) {
    throw new Error('Please send OTP first.')
  }

  try {
    const credential = await confirmationResult.confirm(code)
    await applyProfile(credential.user, profile)
    confirmationResult = null

    if (recaptchaVerifier) {
      recaptchaVerifier.clear()
      recaptchaVerifier = null
    }

    return {
      user: credential.user,
      message: 'Phone number verified successfully.',
    }
  } catch (error) {
    console.error('[auth] otp:verify:error', error)
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function logout() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('[auth] logout:error', error)
    throw new Error(getFriendlyAuthError(error))
  }
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
