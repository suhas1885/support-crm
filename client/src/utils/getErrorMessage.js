/**
 * Safely reads an error message from any thrown value (Error, string, unknown).
 */
export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return fallback
}
