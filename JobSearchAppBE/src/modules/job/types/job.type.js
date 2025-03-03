import { GraphQLBoolean, GraphQLEnumType, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { oneUserResponse } from "../../user/types/user.types.js";
import { companyType } from "../../company/types/company.types.js";


export const commonJobFields = {

    jobLocation: {
        type: new GraphQLEnumType({
            name: 'JobLocationTypes',
            values: {
                onsite: { type: GraphQLString },
                remotely: { type: GraphQLString },
                hybrid: { type: GraphQLString },
            }
        })
    },
    workingTime: {
        type: new GraphQLEnumType({
            name: 'workingTimeTypes',
            values: {
                workingTime: { type: GraphQLString },
                fullTime: { type: GraphQLString },
            }
        })
    },
    seniorityLevel: {
        type: new GraphQLEnumType({
            name: 'seniorityLevelTypes',
            values: {
                fresh: { type: GraphQLString },
                junior: { type: GraphQLString },
                midLevel: { type: GraphQLString },
                senior: { type: GraphQLString },
                teamLead: { type: GraphQLString },
                CTO: { type: GraphQLString },
            }
        })
    },
    jobTitle: { type: GraphQLString },
    technicalSkills: { type: new GraphQLList(GraphQLString) },
}

export const JobFilterInputType = new GraphQLInputObjectType({
    name: 'JobFilter',
    fields: {
        ...commonJobFields
    }
});

export const oneJobResponse = new GraphQLObjectType({
    name: 'oneJobResponse',
    fields: {

        ...commonJobFields,

        jobDescription: { type: GraphQLString },
        softSkills: { type: new GraphQLList(GraphQLString) },
        addedBy: { type: oneUserResponse },
        updatedBy: { type: oneUserResponse },
        closed: { type: GraphQLBoolean },
        companyId: { type: companyType },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
})