import mongoose, { model, Schema, Types } from "mongoose";
import { jobLocationTypes, roleTypes, seniorityLevel, workingTime } from "../../utils/common/common.enum.js";
import { applicationModel } from "./Application.model.js";
import * as DBService from '../Services/DB.service.js'


const jobSchema = new Schema({

    jobTitle: {
        type: String,
        minlength: 2,
        maxlength: 30
    },
    jobLocation: {
        type: String,
        enum: Object.values(jobLocationTypes),
        default: jobLocationTypes.onsite
    },
    workingTime: {
        type: String,
        enum: Object.values(workingTime),
        default: workingTime.fullTime
    },
    seniorityLevel: {
        type: String,
        enum: Object.values(seniorityLevel),
        default: seniorityLevel.fresh
    },
    jobDescription: String,
    technicalSkills: [String],
    softSkills: [String],
    addedBy: { type: Types.ObjectId, ref: roleTypes.user },
    updatedBy: { type: Types.ObjectId, ref: roleTypes.user },
    closed: {
        type: Boolean,
        default: false
    },
    companyId: { type: Types.ObjectId, ref: 'Company' }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//delete all applications related to this job
jobSchema.post('findOneAndDelete', async function (doc) {

    if (doc) {

        // delete all applications which are on this job
        await DBService.deleteMany({
            model: applicationModel,
            filter: {
                jobId: doc._id
            }
        })
    }
})

//virtual field to populate and get applications data related to this job
jobSchema.virtual('application', {
    localField: '_id',
    foreignField: 'jobId',
    ref: 'Application'
})

export const jobModel = mongoose.models.Job || model('Job', jobSchema)