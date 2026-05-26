/**
 * Shows TKT-001 when available; fallback for very old records.
 */
export function getTicketDisplayId(ticket) {
  if (ticket.ticketId) return ticket.ticketId
  if (ticket.id) return `ID-${ticket.id.slice(0, 8)}`
  return '—'
}
