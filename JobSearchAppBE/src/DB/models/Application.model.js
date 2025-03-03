import mongoose, { model, Schema, Types } from "mongoose";
import { roleTypes, statusTypes } from "../../utils/common/common.enum.js";

const applicationSchema = new Schema({

    jobId: { type: Types.ObjectId, ref: 'Job' },
    userId: { type: Types.ObjectId, ref: roleTypes.user },
    userCV: { secure_url: String, public_id: String },
    
    status: {
        type: String,
        enum: Object.values(statusTypes),
        default: statusTypes.pending
    },
}, {
    timestamps: true
})


export const applicationModel = mongoose.models.Application || model('Application', applicationSchema)