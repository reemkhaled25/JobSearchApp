import { asyncHandler } from "../utils/Response/Error/error.handling.js"
import { tokenDecoding } from "../utils/Security/token.js"


export const authentcation = () => {
    return asyncHandler(
        async (req, res, next) => {

            const user = await tokenDecoding(
                {
                    authorization: req.headers.authorization,
                    next,
                    tokenType: 'access'
                }
            )
            req.user = user

            return next()
        }
    )
}

export const authorization = (Roles = []) => {

    return asyncHandler(
        async (req, res, next) => {

            if (!Roles.includes(req.user.role)) {
                return next(new Error('Not authorized', { cause: 403 }))
            }

            return next()
        }
    )
}