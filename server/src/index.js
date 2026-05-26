import app from './app.js'
import { env, isFirebaseConfigured, validateEnv } from './config/env.js'
import { verifyFirestoreConnection } from './config/firebase.js'

async function startServer() {
  validateEnv()

  if (isFirebaseConfigured()) {
    try {
      await verifyFirestoreConnection()
      console.log('Firestore: connected')
    } catch (error) {
      console.warn('Firestore: connection failed —', error.message)
    }
  } else if (env.isDevelopment) {
    console.warn(
      'Firestore: not configured (add Firebase Admin vars to server/.env)',
    )
  }

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`)
    console.log(`Environment: ${env.nodeEnv}`)
    console.log(`CORS allowed for: ${env.clientUrl}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
