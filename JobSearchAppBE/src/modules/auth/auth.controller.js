import { Router } from "express";
import * as registerationServices from './services/registeration.service.js'
import * as loginServices from './services/login.service.js'
import * as validators from './auth.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
const router = Router()

router.post(
    '/signup',
    validation(validators.signup),
    registerationServices.signup
)

router.post(
    '/Confirm-OTP',
    validation(validators.ConfirmOTP),
    registerationServices.confirmOTP
)

router.post(
    '/login',
    validation(validators.login),
    loginServices.login
)

router.post(
    '/loginWithGmail',
    loginServices.loginWithGmail
)

router.post(
    '/signupWithGmail',
    loginServices.loginWithGmail
)

router.post(
    '/forget-password',
    validation(validators.forgetPassword),
    loginServices.forgetPassword
)

router.post(
    '/reset-password',
    validation(validators.resetPassword),
    loginServices.resetPassword
)

router.get(
    '/refresh-token',
    loginServices.refreshToken
)
export default router