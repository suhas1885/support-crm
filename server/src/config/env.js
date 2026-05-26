import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load server/.env (works whether you run from server/ or project root)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

function getEnv(key, defaultValue = '') {
  return process.env[key] ?? defaultValue
}

function requireEnv(key) {
  const value = getEnv(key)
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getFirebasePrivateKey() {
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!raw) return ''
  return raw.replace(/\\n/g, '\n')
}

const nodeEnv = getEnv('NODE_ENV', 'development')

export const env = {
  nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  port: Number(requireEnv('PORT')),
  clientUrl: requireEnv('CLIENT_URL'),

  firebase: {
    projectId: getEnv('FIREBASE_PROJECT_ID'),
    clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
    privateKey: getFirebasePrivateKey(),
  },
}

export function validateEnv() {
  // Kept for future validation rules. PORT & CLIENT_URL are required when env is imported.
}

export function isFirebaseConfigured() {
  const { projectId, clientEmail, privateKey } = env.firebase
  const hasPlaceholders =
    projectId.startsWith('your-') ||
    clientEmail.includes('your-service-account') ||
    privateKey.includes('YOUR_KEY_HERE')
  return Boolean(projectId && clientEmail && privateKey && !hasPlaceholders)
}
