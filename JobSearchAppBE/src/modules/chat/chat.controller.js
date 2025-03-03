import { Router } from "express";
import { authentcation } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './chat.validation.js'
import * as chatService from '../chat/services/chat.service.js'
const router = Router()


router.get(
    '/:friendId',
    validation(validators.getChat),
    authentcation(),
    chatService.getChat
)
export default router