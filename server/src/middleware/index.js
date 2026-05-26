import express from 'express'
import { corsMiddleware } from './cors.js'
import { requestLogger } from './requestLogger.js'

/**
 * Registers all global middleware on the Express app.
 * Order matters: logger → CORS → body parser.
 */
export function applyMiddleware(app) {
  app.use(requestLogger)
  app.use(corsMiddleware)
  app.use(express.json({ limit: '10kb' }))
  app.use(express.urlencoded({ extended: true, limit: '10kb' }))
}
