import { EventEmitter } from 'node:events';
import { emailTemplate } from '../Email/templates/email.template.js';
import { sendEmail } from '../Email/send.email.js';
import * as DBServices from '../../DB/Services/DB.service.js'
import { userModel } from '../../DB/models/User.model.js'
import { createHash } from '../Security/hashing.js';
import { customAlphabet } from 'nanoid';
import { emailTypes, otpTypes } from '../common/common.enum.js';
import { rejectionEmailTemplete } from '../Email/templates/rejectionEmail.templete.js';
import { acceptanceEmailTemplete } from '../Email/templates/accept.templete.js';

export const emailEvent = new EventEmitter();

const sendCode = async ({ data = {}, subject = emailTypes.confirmEmail } = {}) => {

    const { email } = data
    const otp = customAlphabet('0123456789', 4)()
    const hashOTP = createHash({ plainText: otp })

    let updatedData = {}
    let OTP = []
    switch (subject) {

        case emailTypes.confirmEmail:
            updatedData = { code: hashOTP, type: otpTypes.confirmEmail, expiresIn: Date.now() + 600000 }
            break;

        case emailTypes.forgetPassword:
            updatedData = { code: hashOTP, type: otpTypes.forgetPassword, expiresIn: Date.now() + 600000 }
            break;

        default:
            break;
    }

    OTP.push(updatedData)

    await DBServices.findOneAndUpdate({
        model: userModel,
        filter: {
            email,
            deletedAt: { $exists: false },
            bannedAt: { $exists: false }
        },
        data: {
            OTP
        },
        options: {
            new: true,
            runValidators: true
        }
    })

    const html = emailTemplate({ code: otp })
    await sendEmail({ to: email, html, subject })
}


emailEvent.on('sendConfirmEmail', async (data) => {

    await sendCode({ data, subject: emailTypes.confirmEmail })
})

emailEvent.on('forgetPassword', async (data) => {

    await sendCode({ data, subject: emailTypes.forgetPassword })
})

emailEvent.on('sendRejectionEmail', async (data) => {

    const { email, applicationOwner, jobTitle, companyName, HRName } = data
    const html = rejectionEmailTemplete({ applicationOwner, jobTitle, companyName, HRName })
    const subject = ` Your Application for ${jobTitle} at ${companyName}`

    await sendEmail({ to: email, html, subject })
})

emailEvent.on('sendAcceptanceEmail', async (data) => {

    const { email, applicationOwner, jobTitle, companyName, companyEmail, HRName, startDate, responseDeadline, salary } = data
    const html = acceptanceEmailTemplete({
        applicationOwner,
        jobTitle,
        companyName,
        companyEmail,
        HRName,
        startDate,
        responseDeadline,
        salary
    })
    const subject = ` Your Application for ${jobTitle} at ${companyName}`

    await sendEmail({ to: email, html, subject })
})
