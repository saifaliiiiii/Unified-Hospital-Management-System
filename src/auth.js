import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, getFirebaseDiagnostics, googleProvider, providerMap } from './firebase'

const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use':
    'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential':
    'Incorrect email or password. Please try again.',
  'auth/user-not-found':
    'No account was found for this email address.',
  'auth/wrong-password': 'The password you entered is incorrect.',
  'auth/missing-password': 'Please enter your password.',
  'auth/weak-password': 'Weak password (kamzor password). Use at least 6 characters.',
  'auth/popup-closed-by-user':
    'Google sign-in was cancelled before it finished.',
  'auth/popup-blocked':
    'Your browser blocked the sign-in popup. Allow popups and try again.',
  'auth/network-request-failed':
    'Network error. Check your internet connection and try again.',
  'auth/too-many-requests':
    'Too many attempts detected. Please wait a moment and try again.',
  'auth/operation-not-allowed':
    'This sign-in method is disabled in Firebase Console. Enable it under Authentication > Sign-in method.',
  'auth/unauthorized-domain':
    'This domain is not authorized for Firebase Authentication. Add it under Authentication > Settings > Authorized domains.',
  'auth/configuration-not-found':
    'Google sign-in is not configured correctly in Firebase Console.',
  'auth/cancelled-popup-request':
    'Another sign-in popup is already open. Close it and try again.',
  'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
  'auth/missing-phone-number': 'Phone number is required to send OTP.',
  'auth/quota-exceeded':
    'OTP quota exceeded. Please wait a bit before requesting another code.',
  'auth/captcha-check-failed':
    'reCAPTCHA verification failed. Refresh and try again.',
  'auth/missing-verification-code': 'Please enter the OTP code.',
  'auth/invalid-verification-code': 'Incorrect OTP. Please check the code and try again.',
  'auth/code-expired': 'OTP expired. Please request a new code.',
  'auth/app-not-authorized':
    'This app is not authorized to use Firebase Authentication with the current project settings.',
  'auth/invalid-app-credential':
    'The phone authentication app credential is invalid. Check the site domain, reCAPTCHA, and Firebase Phone provider settings.',
  'auth/missing-app-credential':
    'Phone verification could not start because the app credential was missing.',
  'auth/web-storage-unsupported':
    'Your browser does not support the storage required for this sign-in flow.',
  'auth/internal-error':
    'Firebase Authentication returned an internal error. Check provider configuration and try again.',
  'auth/argument-error':
    'A required authentication parameter is missing or invalid.',
}

let recaptchaVerifierInstance = null
let confirmationResultInstance = null
let recaptchaContainerId = null

function getRuntimeAuthContext() {
  if (typeof window === 'undefined') {
    return {
      hostname: null,
      origin: null,
      href: null,
    }
  }

  return {
    hostname: window.location.hostname,
    origin: window.location.origin,
    href: window.location.href,
  }
}

function getFriendlyAuthError(error) {
  if (error?.message?.includes('BILLING_NOT_ENABLED')) {
    return 'Phone authentication requires billing to be enabled for this Firebase project. Enable billing in Google Cloud / Firebase and try again.'
  }

  if (error?.code === 'auth/unauthorized-domain') {
    const { hostname } = getRuntimeAuthContext()
    return hostname
      ? `This domain (${hostname}) is not authorized for Firebase Authentication. Add it under Authentication > Settings > Authorized domains.`
      : AUTH_ERROR_MESSAGES['auth/unauthorized-domain']
  }

  return AUTH_ERROR_MESSAGES[error?.code] || 'Something went wrong. Please try again.'
}

function assertFirebaseAuthReady() {
  const diagnostics = getFirebaseDiagnostics()
  const missing = []

  if (!diagnostics.projectId) {
    missing.push('projectId')
  }

  if (!diagnostics.authDomain) {
    missing.push('authDomain')
  }

  if (!diagnostics.appId) {
    missing.push('appId')
  }

  if (missing.length > 0) {
    throw new Error(
      `Firebase configuration is incomplete. Missing: ${missing.join(', ')}.`,
    )
  }

  logAuthDebug('firebase:ready', diagnostics)
}

function logAuthDebug(step, payload) {
  console.info(`[auth] ${step}`, payload)
}

function logAuthError(step, error, meta = {}) {
  console.error(`[auth] ${step} failed`, {
    code: error?.code,
    message: error?.message,
    customData: error?.customData,
    ...meta,
  })
}

async function saveUserProfile(user, profile = {}, options = {}) {
  try {
    const payload = {
      uid: user.uid,
      email: user.email,
      displayName: profile.fullName || user.displayName || '',
      phoneNumber: profile.phoneNumber || user.phoneNumber || '',
      provider: user.providerData?.[0]?.providerId || 'password',
      lastLoginAt: serverTimestamp(),
    }

    if (options.isNewUser) {
      payload.createdAt = serverTimestamp()
    }

    await setDoc(
      doc(db, 'users', user.uid),
      payload,
      { merge: true },
    )
  } catch (error) {
    console.warn('Unable to store user profile in Firestore:', error)
  }
}

function normalizePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/[^\d+]/g, '')
}

function getRecaptchaVerifier(containerId) {
  if (typeof window === 'undefined') {
    throw new Error('Phone authentication is only available in the browser.')
  }

  if (!containerId) {
    throw new Error('Missing reCAPTCHA container.')
  }

  const container = document.getElementById(containerId)

  if (!container) {
    throw new Error('Unable to initialize phone authentication UI.')
  }

  if (recaptchaVerifierInstance && recaptchaContainerId === containerId) {
    return recaptchaVerifierInstance
  }

  if (recaptchaVerifierInstance && recaptchaContainerId !== containerId) {
    recaptchaVerifierInstance.clear()
    recaptchaVerifierInstance = null
  }

  recaptchaVerifierInstance = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      logAuthDebug('phone:recaptcha:solved', {})
    },
    'expired-callback': () => {
      logAuthDebug('phone:recaptcha:expired', {})
      recaptchaVerifierInstance = null
    },
  })
  recaptchaContainerId = containerId

  return recaptchaVerifierInstance
}

export async function signup(email, password, profile = {}) {
  try {
    assertFirebaseAuthReady()
    logAuthDebug('signup:start', {
      email,
      hasPassword: Boolean(password),
      hasFullName: Boolean(profile.fullName),
    })

    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (profile.fullName) {
      await updateProfile(credential.user, {
        displayName: profile.fullName,
      })
    }

    await saveUserProfile(credential.user, profile, { isNewUser: true })

    logAuthDebug('signup:success', {
      uid: credential.user.uid,
      email: credential.user.email,
    })

    return {
      user: credential.user,
      message: 'Account created successfully.',
    }
  } catch (error) {
    logAuthError('signup', error, { email })
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function login(email, password) {
  try {
    assertFirebaseAuthReady()
    logAuthDebug('login:start', {
      email,
      hasPassword: Boolean(password),
    })

    const credential = await signInWithEmailAndPassword(auth, email, password)

    logAuthDebug('login:success', {
      uid: credential.user.uid,
      email: credential.user.email,
    })

    return {
      user: credential.user,
      message: 'Logged in successfully.',
    }
  } catch (error) {
    logAuthError('login', error, { email })
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function loginWithGoogle() {
  try {
    assertFirebaseAuthReady()
    const runtimeContext = getRuntimeAuthContext()

    logAuthDebug('google:start', {
      provider: 'google',
      authDomain: auth.config.authDomain,
      ...runtimeContext,
    })

    const credential = await signInWithPopup(auth, googleProvider)
    await saveUserProfile(credential.user)

    logAuthDebug('google:success', {
      uid: credential.user.uid,
      email: credential.user.email,
      ...runtimeContext,
    })

    return {
      user: credential.user,
      message: 'Signed in with Google successfully.',
    }
  } catch (error) {
    logAuthError('google', error, {
      authDomain: auth.config.authDomain,
      ...getRuntimeAuthContext(),
    })
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function sendOTP(phoneNumber, containerId = 'recaptcha-container') {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber)

  try {
    assertFirebaseAuthReady()
    logAuthDebug('phone:send:start', {
      phoneNumber: normalizedPhoneNumber,
      containerId,
    })

    const verifier = getRecaptchaVerifier(containerId)
    confirmationResultInstance = await signInWithPhoneNumber(
      auth,
      normalizedPhoneNumber,
      verifier,
    )

    logAuthDebug('phone:send:success', {
      phoneNumber: normalizedPhoneNumber,
    })

    return {
      message: 'OTP sent successfully. Enter the verification code to continue.',
    }
  } catch (error) {
    logAuthError('phone:send', error, {
      phoneNumber: normalizedPhoneNumber,
    })

    if (recaptchaVerifierInstance) {
      recaptchaVerifierInstance.clear()
      recaptchaVerifierInstance = null
      recaptchaContainerId = null
    }

    throw new Error(getFriendlyAuthError(error))
  }
}

export async function verifyOTP(code, profile = {}) {
  const normalizedCode = code.trim()

  if (!confirmationResultInstance) {
    throw new Error('Please send OTP first.')
  }

  try {
    assertFirebaseAuthReady()
    logAuthDebug('phone:verify:start', {
      hasCode: Boolean(normalizedCode),
    })

    const credential = await confirmationResultInstance.confirm(normalizedCode)

    if (profile.fullName && !credential.user.displayName) {
      await updateProfile(credential.user, {
        displayName: profile.fullName,
      })
    }

    await saveUserProfile(credential.user, profile, {
      isNewUser: Boolean(profile.fullName),
    })

    confirmationResultInstance = null
    if (recaptchaVerifierInstance) {
      recaptchaVerifierInstance.clear()
      recaptchaVerifierInstance = null
      recaptchaContainerId = null
    }

    logAuthDebug('phone:verify:success', {
      uid: credential.user.uid,
      phoneNumber: credential.user.phoneNumber,
    })

    return {
      user: credential.user,
      message: 'Phone number verified successfully.',
    }
  } catch (error) {
    logAuthError('phone:verify', error)
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function loginWithProvider(providerName) {
  const provider = providerMap[providerName]

  if (!provider) {
    throw new Error('This sign-in provider is not configured yet.')
  }

  try {
    assertFirebaseAuthReady()
    logAuthDebug('provider:start', {
      providerName,
      authDomain: auth.config.authDomain,
    })

    const credential = await signInWithPopup(auth, provider)
    await saveUserProfile(credential.user)

    logAuthDebug('provider:success', {
      providerName,
      uid: credential.user.uid,
      email: credential.user.email,
    })

    return {
      user: credential.user,
      message: `Signed in with ${providerName} successfully.`,
    }
  } catch (error) {
    logAuthError(`provider:${providerName}`, error)
    throw new Error(getFriendlyAuthError(error))
  }
}

export async function logout() {
  try {
    assertFirebaseAuthReady()
    logAuthDebug('logout:start', {
      currentUser: auth.currentUser?.email || null,
    })

    await signOut(auth)
    confirmationResultInstance = null
    if (recaptchaVerifierInstance) {
      recaptchaVerifierInstance.clear()
      recaptchaVerifierInstance = null
      recaptchaContainerId = null
    }
    logAuthDebug('logout:success', {})
    return 'Logged out successfully.'
  } catch (error) {
    logAuthError('logout', error)
    throw new Error(getFriendlyAuthError(error))
  }
}

export function subscribeToAuthChanges(callback) {
  logAuthDebug('listener:attached', {
    authDomain: auth.config.authDomain,
  })

  return onAuthStateChanged(auth, (user) => {
    logAuthDebug('listener:changed', {
      uid: user?.uid || null,
      email: user?.email || null,
    })

    callback(user)
  })
}
