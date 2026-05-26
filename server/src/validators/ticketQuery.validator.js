import { ApiError } from '../utils/ApiError.js'
import { FILTER_STATUSES } from '../constants/ticketStatus.js'

/**
 * Maps friendly status input to Firestore value.
 * Examples: "In Progress" → in_progress, "open" → open
 */
function normalizeStatusFilter(rawStatus) {
  const key = String(rawStatus).trim().toLowerCase().replace(/[\s-]+/g, '_')

  const aliases = {
    open: 'open',
    in_progress: 'in_progress',
    inprogress: 'in_progress',
    closed: 'closed',
  }

  return aliases[key] ?? key
}

/**
 * Reads and validates ?search= and ?status= from the URL query string.
 */
export function parseTicketQuery(query = {}) {
  const search = String(query.search ?? query.q ?? '').trim()
  const rawStatus = String(query.status ?? '').trim()

  let status = null

  if (rawStatus) {
    status = normalizeStatusFilter(rawStatus)

    if (!FILTER_STATUSES.includes(status)) {
      throw new ApiError(
        400,
        `status must be one of: ${FILTER_STATUSES.join(', ')} (examples: open, in_progress, closed)`,
      )
    }
  }

  return { search, status }
}
