import { ApiError } from '../utils/ApiError.js'

/**
 * Runs when no route matched the request URL.
 */
export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}
