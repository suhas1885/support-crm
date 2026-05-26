import {
  createTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from '../services/ticket.service.js'
import { validateCreateTicketBody } from '../validators/ticket.validator.js'
import { validateUpdateTicketBody } from '../validators/ticketUpdate.validator.js'
import { parseTicketQuery } from '../validators/ticketQuery.validator.js'
import { ApiError } from '../utils/ApiError.js'

/**
 * GET /api/tickets
 */
export async function getTicketsHandler(req, res) {
  const queryFilters = parseTicketQuery(req.query)
  const { tickets, count, filters } = await getTickets(queryFilters)

  const hasFilters = Boolean(filters.search || filters.status)

  res.json({
    success: true,
    message:
      count > 0
        ? 'Tickets fetched successfully'
        : hasFilters
          ? 'No tickets match your search or filter'
          : 'No tickets found',
    count,
    filters,
    data: tickets,
  })
}

/**
 * GET /api/tickets/:id
 */
export async function getTicketByIdHandler(req, res) {
  const { id } = req.params
  if (!id?.trim()) {
    throw new ApiError(400, 'Ticket id is required')
  }

  const ticket = await getTicketById(id)

  res.json({
    success: true,
    message: 'Ticket fetched successfully',
    data: ticket,
  })
}

/**
 * PATCH /api/tickets/:id
 * Body: { status?, note?, author? }
 */
export async function updateTicketHandler(req, res) {
  const { id } = req.params
  if (!id?.trim()) {
    throw new ApiError(400, 'Ticket id is required')
  }

  const updates = validateUpdateTicketBody(req.body)
  const ticket = await updateTicket(id, updates)

  res.json({
    success: true,
    message: 'Ticket updated successfully',
    data: ticket,
  })
}

/**
 * POST /api/tickets
 */
export async function createTicketHandler(req, res) {
  const ticketInput = validateCreateTicketBody(req.body)
  const ticket = await createTicket(ticketInput)

  res.status(201).json({
    success: true,
    message: 'Ticket created successfully',
    ticket_id: ticket.ticketId,
    created_at: ticket.createdAt,
    data: ticket,
  })
}
