import { Router } from 'express'
import { getFirebaseStatus } from '../controllers/firebase.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/firebase/status', asyncHandler(getFirebaseStatus))

export default router
