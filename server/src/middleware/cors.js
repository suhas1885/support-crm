import cors from 'cors'
import { env } from '../config/env.js'

/**
 * Allows only your React app (CLIENT_URL) to call this API from the browser.
 */
export const corsMiddleware = cors({
  origin: env.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
