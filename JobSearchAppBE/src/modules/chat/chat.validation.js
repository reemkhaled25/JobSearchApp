import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const getChat = Joi.object().keys({
    friendId: generalFields.id.required()
}).required()