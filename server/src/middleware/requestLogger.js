import { env } from '../config/env.js'

/**
 * Logs each incoming request in development (helps debugging).
 */
export function requestLogger(req, _res, next) {
  if (env.isDevelopment) {
    console.log(`${req.method} ${req.originalUrl}`)
  }
  next()
}
