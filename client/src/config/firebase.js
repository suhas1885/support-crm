import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { env, isFirebaseConfigured } from './env.js'

export { isFirebaseConfigured }

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  ...(env.firebase.measurementId && {
    measurementId: env.firebase.measurementId,
  }),
}

let app = null
let db = null

/**
 * Returns Firebase app only when env vars are set.
 * Avoids crashing the whole React app during initial setup.
 */
export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase Web SDK is not configured. Fill client/.env.local with values from Firebase Console.',
    )
  }

  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  }

  return app
}

export function getFirestoreDb() {
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}
