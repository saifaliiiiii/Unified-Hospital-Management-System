import { Router } from 'express'
import { createChatCompletion } from '../controllers/chatController.js'

const router = Router()

router.post('/', createChatCompletion)

export default router
