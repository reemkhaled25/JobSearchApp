import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";


export const imageType = new GraphQLObjectType({
    name: 'imageResponse',
    description: 'Image response data type',
    fields: {
        secure_url: { type: GraphQLString },
        public_id: { type: GraphQLString },
    }
})

export const userType = {

    _id: { type: GraphQLID },
    userName: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    email: { type: GraphQLString },
    profilePic: { type: imageType },
    coverPic: { type: imageType },

    gender: {
        type: new GraphQLEnumType({
            name: 'genderTypes',
            values: {
                male: { type: GraphQLString },
                female: { type: GraphQLString },
            }
        })
    },
    DOB: { type: GraphQLString },

    provider: {
        type: new GraphQLEnumType({
            name: 'providerTypes',
            values: {
                system: { type: GraphQLString },
                google: { type: GraphQLString },
            }
        })
    },

    role: {
        type: new GraphQLEnumType({
            name: 'roleTypes',
            values: {
                User: { type: GraphQLString },
                Admin: { type: GraphQLString },
            }
        })
    },

    isConfirmed: { type: GraphQLBoolean },
    deletedAt: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    changeCredentialTime: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
}

export const oneUserResponse = new GraphQLObjectType({

    name: 'oneUserResponse',
    description: 'one user response data types',
    fields: {
        ...userType,
        updatedBy: {
            type: new GraphQLObjectType({
                name: 'modificationUser',
                description: 'The person who made any updates',
                fields: {
                    ...userType
                }
            })
        },
    }
})