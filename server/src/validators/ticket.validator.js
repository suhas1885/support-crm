import { ApiError } from '../utils/ApiError.js'
import {
  DEFAULT_TICKET_STATUS,
  TICKET_STATUSES,
} from '../constants/ticketStatus.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates and normalizes the request body for creating a ticket.
 * Returns a clean object ready to save in Firestore.
 */
export function validateCreateTicketBody(body) {
  if (!body || typeof body !== 'object') {
    throw new ApiError(400, 'Request body is required')
  }

  // Accept camelCase (our app) or snake_case (assignment API style)
  const customerName = String(
    body.customerName ?? body.customer_name ?? '',
  ).trim()
  const email = String(body.email ?? body.customer_email ?? '')
    .trim()
    .toLowerCase()
  const subject = String(body.subject ?? body.issue_title ?? '').trim()
  const description = String(
    body.description ?? body.issue_description ?? '',
  ).trim()
  const status = body.status
    ? String(body.status).trim().toLowerCase()
    : DEFAULT_TICKET_STATUS

  if (customerName.length < 2) {
    throw new ApiError(400, 'customerName must be at least 2 characters')
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'A valid email is required')
  }

  if (subject.length < 3) {
    throw new ApiError(400, 'subject must be at least 3 characters')
  }

  if (description.length < 10) {
    throw new ApiError(400, 'description must be at least 10 characters')
  }

  if (!TICKET_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `status must be one of: ${TICKET_STATUSES.join(', ')}`,
    )
  }

  return { customerName, email, subject, description, status }
}
