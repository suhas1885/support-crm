import { Router } from 'express'
import {
  createTicketHandler,
  getTicketByIdHandler,
  getTicketsHandler,
  updateTicketHandler,
} from '../controllers/ticket.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/tickets', asyncHandler(getTicketsHandler))
router.post('/tickets', asyncHandler(createTicketHandler))
router.get('/tickets/:id', asyncHandler(getTicketByIdHandler))
router.patch('/tickets/:id', asyncHandler(updateTicketHandler))

export default router
