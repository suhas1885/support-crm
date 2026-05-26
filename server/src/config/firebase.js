import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { env, isFirebaseConfigured } from './env.js'

let firestoreDb = null

/**
 * Initializes Firebase Admin once and returns Firestore.
 * Safe to call multiple times — returns the same instance.
 */
export function getFirestoreDb() {
  if (firestoreDb) {
    return firestoreDb
  }

  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in server/.env',
    )
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.firebase.projectId,
        clientEmail: env.firebase.clientEmail,
        privateKey: env.firebase.privateKey,
      }),
    })
  }

  firestoreDb = getFirestore()
  return firestoreDb
}

/**
 * Quick connectivity check: asks Firestore for collection metadata.
 */
export async function verifyFirestoreConnection() {
  const db = getFirestoreDb()
  await db.listCollections()
  return true
}
