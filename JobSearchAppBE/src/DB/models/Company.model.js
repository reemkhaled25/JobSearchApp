import mongoose, { model, Schema, Types } from "mongoose";
import { roleTypes } from "../../utils/common/common.enum.js";
import * as DBService from '.././Services/DB.service.js'
import { jobModel } from "./Job.model.js";
import { applicationModel } from "./Application.model.js";

const companySchema = new Schema({

    companyName: {
        type: String,
        minlength: 2,
        maxlength: 30,
        unique: true,
        required: true
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 50000,
        required: true

    },

    industry: String,
    address: String,

    numberOfEmployees: {
        minNumberOfEmployee: { type: Number, min: 0 },
        maxNumberOfEmployee: { type: Number, min: 0 }
    },

    companyEmail: {
        type: String,
        unique: true,
        required: true
    },

    CreatedBy: { type: Types.ObjectId, ref: roleTypes.user },
    Logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: Types.ObjectId, ref: roleTypes.user }],
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: { secure_url: String, public_id: String },

    approvedByAdmin: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

//delete all related jobs and applications related to deleted jobs
companySchema.post('findOneAndUpdate', async (doc) => {

    if (doc?.deletedAt) {

        //find all related jobs to store its ids
        const jobs = await DBService.find({
            model: jobModel,
            filter: {
                companyId: doc._id
            }
        });

        const jobIds = jobs.map(job => job._id);

        //delete all jobs related to deleted company
        await DBService.deleteMany({
            model: jobModel,
            filter: {
                companyId: doc._id
            }
        })

        //delete all applications related to deleted jobs
        await DBService.deleteMany({
            model: applicationModel,
            filter: {
                jobId: { $in: jobIds }
            }
        })
    }
})

//virtual field to populate on and get all related jobs data
companySchema.virtual('RelatedJobs', {
    localField: '_id',
    foreignField: 'companyId',
    ref: 'Job'
})

export const companyModel = mongoose.models.Company || model('Company', companySchema)