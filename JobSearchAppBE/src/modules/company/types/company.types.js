import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType, oneUserResponse } from "../../user/types/user.types.js";

export const employeeRangeType = new GraphQLObjectType({
    name: "numberOfEmployeesResponse",
    fields: {
        minNumberOfEmployee: { type: GraphQLInt },
        maxNumberOfEmployee: { type: GraphQLInt },
    }
})

export const companyType = new GraphQLObjectType({
    name: 'oneCompanyResponse',
    fields: {
        _id: { type: GraphQLID },
        companyName: { type: GraphQLString },
        description: { type: GraphQLString },
        industry: { type: GraphQLString },
        address: { type: GraphQLString },
        companyEmail: { type: GraphQLString },
        CreatedBy: { type: oneUserResponse },
        legalAttachment: { type: imageType },
        approvedByAdmin: { type: GraphQLBoolean },
        Logo: { type: imageType },
        coverPic: { type: imageType },
        HRs: { type: new GraphQLList(oneUserResponse) },
        bannedAt: { type: GraphQLString },
        deletedAt: { type: GraphQLString },
        legalAttachment: { type: imageType },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
})