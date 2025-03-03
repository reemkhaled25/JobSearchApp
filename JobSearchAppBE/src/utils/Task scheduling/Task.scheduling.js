import cron from 'node-cron';
import * as DBservices from '../../DB/Services/DB.service.js'
import { userModel } from '../../DB/models/User.model.js';


// Function to delete Expired OTPs from DB every 6 hours
export const deleteExpiredOtp = () => {

    cron.schedule('0 */6 * * *', async () => {

        const users = await DBservices.find({
            model: userModel
        })

        for (const user of users) {

            if (user?.OTP?.length) {
                
                for (const otp of user.OTP) {

                    if (otp.expiresIn < Date.now()) {

                        await DBservices.findOneAndUpdate({
                            model: userModel,
                            filter: {
                                _id: user._id
                            },
                            data: {
                                $unset: { OTP: 0 }
                            }
                        })
                    }
                }
            }
        }
    });
}

