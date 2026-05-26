/**
 * Custom error class for API responses.
 * Throw this in controllers/services when you know the HTTP status.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
  }
}
