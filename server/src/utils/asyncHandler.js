/**
 * Wraps async route handlers so errors reach Express error middleware.
 * Without this, unhandled promise rejections can crash the server.
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
