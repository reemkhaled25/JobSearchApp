import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import * as dashboardQuery from './user/dashboard.graph.controller.js'
import * as jobQuery from './job/job.graph.controller.js'

export const schema = new GraphQLSchema({
    
    query: new GraphQLObjectType({
        name: 'mainGraphQLSchema',
        fields: {

            ...dashboardQuery.query,
            ...jobQuery.query

        }
    })
})