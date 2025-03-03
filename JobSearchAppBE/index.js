import express from 'express'
import * as dotenv from 'dotenv';
import path from 'node:path';
import bootstrap from './src/app.controller.js'
import chalk from 'chalk';
import { runIo } from './src/modules/socket/socket.controller.js';

dotenv.config({ path: path.resolve('./src/config/.env.prod') })


const app = express()
const port = process.env.PORT || 5000


bootstrap(app, express)
const httpServer = app.listen(port, () => console.log(chalk.blue(`Example app listening on port ${port}!`)))

runIo(httpServer)




