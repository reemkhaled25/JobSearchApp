import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import * as JobQueryServices from './services/job.query.sevice.js'
import { JobFilterInputType, oneJobResponse } from "./types/job.type.js";

export const query = {

    getAllJobs: {
        type: new GraphQLObjectType({
            name: 'AllJobsResponse',
            fields: {
                data: { type: new GraphQLList(oneJobResponse) },
                size: { type: GraphQLInt },
                page: { type: GraphQLInt },
                count: { type: GraphQLInt }
            }
        }),
        args: {
            authorization: { type: new GraphQLNonNull(GraphQLString) },
            size: { type: GraphQLInt },
            page: { type: GraphQLInt },
            filter: { type: JobFilterInputType }
        },
        resolve: JobQueryServices.getAllJobs
    }
}