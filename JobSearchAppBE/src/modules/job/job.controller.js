import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './job.validation.js'
import * as jobService from './services/job.service.js'
import { authentcation } from "../../middleware/auth.middleware.js";
import applicationController from '../application/application.controller.js'


const router = Router({
    mergeParams: true
})

router.use('/:jobId/application', applicationController)


router.post('/',
    validation(validators.addJob),
    authentcation(),
    jobService.addJob
)

router.patch('/update-job/:jobId',
    validation(validators.updateJob),
    authentcation(),
    jobService.updateJob
)

router.delete('/delete-job/:jobId',
    validation(validators.deleteJob),
    authentcation(),
    jobService.deleteJob
)

router.get('/getAllOrSpecificJob',
    validation(validators.getAllOrSpecificJob),
    authentcation(),
    jobService.getAllOrSpecificJob
)

export default router