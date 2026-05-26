import { httpClient } from './httpClient.js'

/**
 * GET /api/firebase/status
 * Checks Firestore connection through Express backend.
 */
export async function getFirebaseServerStatus() {
  return httpClient.get('/firebase/status')
}
