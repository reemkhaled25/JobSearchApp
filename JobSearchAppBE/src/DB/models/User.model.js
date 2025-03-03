import mongoose, { model, Schema, Types } from "mongoose";
import { createHash } from "../../utils/Security/hashing.js";
import { decryption, encryption } from "../../utils/Security/encryption.js";
import { genderTypes, otpTypes, providerTypes, roleTypes } from "../../utils/common/common.enum.js";
import * as DBService from '../Services/DB.service.js'
import { jobModel } from "./Job.model.js";
import { applicationModel } from "./Application.model.js";
import { companyModel } from "./Company.model.js";

const validateDOB = (DOB) => {

    const currentDate = new Date()

    if (DOB >= currentDate) {
        return false
    }

    if ((currentDate.getFullYear() - DOB.getFullYear()) < 18) {
        return false

    } else {
        return true
    }
}

const userSchema = new Schema({

    firstName: {
        type: String,
        minlength: 2,
        maxlength: 10,
        required: true
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 10,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(genderTypes),
        default: genderTypes.male
    },
    DOB: {
        type: Date,
        validate: {
            validator: validateDOB,
            message: `Entered date is not a valid date of birth. It must be in the future and age of greater than 18`
        }
    },

    mobileNumber: String,
    profilePic: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },

    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,

        // function to make password required when user signup or login without gmail service
        required: function () {
            return this.provider === providerTypes.system ? true : false
        }
    },
    provider: {
        type: String,
        enum: Object.values(providerTypes),
        default: providerTypes.system
    },
    role: {
        type: String,
        enum: Object.values(roleTypes),
        default: roleTypes.user
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },

    deletedAt: Date,
    bannedAt: Date,
    updatedBy: { type: Types.ObjectId, ref: roleTypes.user },
    friends: [{ type: Types.ObjectId, ref: roleTypes.user }],
    changeCredentialTime: Date,

    OTP: [{
        code: String,
        type: {
            type: String,
            enum: Object.values(otpTypes),
            default: otpTypes.confirmEmail
        },
        expiresIn: Date
    }]

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

//encrypt mobileNumber and hash passwod before saving in DB
userSchema.pre('save', function (next, doc) {

    this.password = createHash({
        plainText: this.password
    })

    this.mobileNumber = encryption({
        plainText: this.mobileNumber
    })
    next()
})

//decrypt mobileNumber before display data for user
userSchema.post('findOne', function (doc) {

    if (doc) {
        doc.mobileNumber = decryption({
            cipherText: doc?.mobileNumber
        })
    }
})

//delete all related jobs , applications and applications on deleted job after deleting user
userSchema.post('findOneAndUpdate', async function (doc) {

    if (doc?.deletedAt) {

        //find all companies that are created by by this user 
        await DBService.findOneAndUpdate({
            model: companyModel,
            filter: {
                CreatedBy: doc._id
            }, data: {
                deletedAt: Date.now()
            }, options: {
                new: true
            }
        })

        //find all jobs that are added by this user 
        const jobs = await DBService.find({
            model: jobModel,
            filter: {
                addedBy: doc._id
            }
        })

        //store all jobs ids that founded 
        const jobIds = jobs.map(job => job._id);

        //delete all jobs that is added by this user 
        await DBService.deleteMany({
            model: jobModel,
            filter: {
                addedBy: doc._id
            }
        })

        //delete all applications which are on this deleted jobs 
        await DBService.deleteMany({
            model: applicationModel,
            filter: {
                jobId: { $in: jobIds }
            }
        })

        //delete all applications which are made by this deleted user 
        await DBService.deleteMany({
            model: applicationModel,
            filter: {
                userId: doc._id
            }
        })
    }
})

//virtual field to display userName 
userSchema.virtual('userName').set(function (value) {
    this.firstName = value.split(' ')[0]
    this.lastName = value.split(' ')[1]
}).get(function () {
    return this.firstName + " " + this.lastName
})


export const userModel = mongoose.models.User || model(roleTypes.user, userSchema)

export const socketConnections = new Map()