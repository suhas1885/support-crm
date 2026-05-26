import { env, isFirebaseConfigured } from '../config/env.js'
import {
  getFirestoreDb,
  verifyFirestoreConnection,
} from '../config/firebase.js'
import { ApiError } from '../utils/ApiError.js'

/**
 * Returns Firestore connection status for the React app to verify setup.
 */
export async function getFirebaseStatus(_req, res) {
  if (!isFirebaseConfigured()) {
    return res.status(503).json({
      success: false,
      configured: false,
      connected: false,
      message:
        'Firebase Admin env vars are missing. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to server/.env',
    })
  }

  await verifyFirestoreConnection()
  const db = getFirestoreDb()
  const collections = await db.listCollections()
  const collectionIds = collections.map((col) => col.id)

  res.json({
    success: true,
    configured: true,
    connected: true,
    projectId: env.firebase.projectId,
    collections: collectionIds,
    message: 'Firestore is connected',
  })
}
