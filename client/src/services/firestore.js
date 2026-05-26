import { collection, getDocs, limit, query } from 'firebase/firestore'
import { getFirestoreDb } from '../config/firebase.js'
import { isFirebaseConfigured } from '../config/env.js'

const TICKETS_COLLECTION = 'tickets'

/**
 * Example read helper — proves frontend Firestore SDK is wired.
 * Production ticket writes should go through Express API routes.
 */
export async function listTicketCollectionPreview(max = 1) {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured in client/.env.local')
  }

  const db = getFirestoreDb()
  const ticketsRef = collection(db, TICKETS_COLLECTION)
  const snapshot = await getDocs(query(ticketsRef, limit(max)))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}
