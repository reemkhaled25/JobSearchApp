import mongoose from "mongoose"
import chalk from "chalk";
import { deleteExpiredOtp } from "../utils/Task scheduling/Task.scheduling.js";
const connectDB = async () => {

    await mongoose.connect(process.env.DB_URI).then(res => {

            console.log(chalk.blue('DB Connected'));

            //Scheduled task to delete expired otps every 6 hours from DB
            deleteExpiredOtp()

        }).catch(err => {
            console.log('Fail to connect', err);
        })
}
export default connectDB