import { httpClient } from './httpClient.js'

/**
 * GET /api/tickets
 * Fetches tickets with optional search and status filters.
 */
export async function fetchTickets({ search = '', status = '' } = {}) {
  const params = {}

  if (search.trim()) params.search = search.trim()
  if (status) params.status = status

  return httpClient.get('/tickets', { params })
}

/**
 * POST /api/tickets
 * Creates a new support ticket.
 */
export async function createTicket(payload) {
  return httpClient.post('/tickets', payload)
}

/**
 * GET /api/tickets/:id
 * Fetches one ticket with notes.
 */
export async function fetchTicketById(id) {
  return httpClient.get(`/tickets/${id}`)
}

/**
 * PATCH /api/tickets/:id
 * Update status and/or add a note.
 */
export async function updateTicket(id, payload) {
  return httpClient.patch(`/tickets/${id}`, payload)
}
