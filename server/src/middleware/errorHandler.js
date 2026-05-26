import { env } from '../config/env.js'

/**
 * Central place for all API errors (thrown errors + asyncHandler failures).
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'

  if (env.isDevelopment) {
    console.error(`[Error] ${statusCode}: ${message}`)
    if (err.stack) console.error(err.stack)
  } else {
    console.error(`[Error] ${statusCode}: ${message}`)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isDevelopment && err.stack && { stack: err.stack }),
  })
}
