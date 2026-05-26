import { Router } from 'express'
import healthRoutes from './health.routes.js'
import firebaseRoutes from './firebase.routes.js'
import ticketRoutes from './ticket.routes.js'

/**
 * All API routes live under /api
 * Example: GET /api/health, GET /api/firebase/status
 */
const apiRouter = Router()

apiRouter.use(healthRoutes)
apiRouter.use(firebaseRoutes)
apiRouter.use(ticketRoutes)

export default apiRouter
