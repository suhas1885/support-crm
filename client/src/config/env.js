/**
 * Reads Vite environment variables in one place.
 * Only variables prefixed with VITE_ are available in the browser.
 */
function read(key) {
  return import.meta.env[key] ?? ''
}

export const env = {
  apiUrl: read('VITE_API_URL') || '/api',

  firebase: {
    apiKey: read('VITE_FIREBASE_API_KEY'),
    authDomain: read('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: read('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: read('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: read('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: read('VITE_FIREBASE_APP_ID'),
    measurementId: read('VITE_FIREBASE_MEASUREMENT_ID') || undefined,
  },
}

export function isFirebaseConfigured() {
  const { apiKey, projectId, appId } = env.firebase
  const hasValues = Boolean(apiKey && projectId && appId)
  const hasPlaceholders =
    apiKey.startsWith('your_') || projectId.startsWith('your-')
  return hasValues && !hasPlaceholders
}
