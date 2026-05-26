import { ApiError } from '../utils/ApiError.js'
import { TICKET_STATUSES } from '../constants/ticketStatus.js'

function normalizeStatus(raw) {
  return String(raw).trim().toLowerCase().replace(/[\s-]+/g, '_')
}

/**
 * Validates PATCH body: at least one of status or note is required.
 */
export function validateUpdateTicketBody(body) {
  if (!body || typeof body !== 'object') {
    throw new ApiError(400, 'Request body is required')
  }

  const hasStatus = body.status !== undefined && body.status !== ''
  const hasNote = String(body.note ?? body.comment ?? '').trim().length > 0

  if (!hasStatus && !hasNote) {
    throw new ApiError(400, 'Provide status and/or note to update the ticket')
  }

  const result = {}

  if (hasStatus) {
    const status = normalizeStatus(body.status)
    if (!TICKET_STATUSES.includes(status)) {
      throw new ApiError(
        400,
        `status must be one of: ${TICKET_STATUSES.join(', ')}`,
      )
    }
    result.status = status
  }

  if (hasNote) {
    const note = String(body.note ?? body.comment).trim()
    if (note.length < 2) {
      throw new ApiError(400, 'note must be at least 2 characters')
    }
    result.note = note
    result.author = String(body.author ?? 'Support Agent').trim() || 'Support Agent'
  }

  return result
}
