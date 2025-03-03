import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import * as dashboardQueryService from './services/dashboard.query.service.js'
import { oneUserResponse } from "./types/user.types.js"
import { companyType } from "../company/types/company.types.js"

export const query = {
    userList: {
        type: new GraphQLObjectType({
            name: 'paginatedUserResponse',
            fields: {
                data: { type: new GraphQLList(oneUserResponse) },
                size: { type: GraphQLInt },
                page: { type: GraphQLInt },
                count: { type: GraphQLInt },
            }
        }),
        args: {
            authorization: { type: new GraphQLNonNull(GraphQLString) },
            size: { type: GraphQLInt },
            page: { type: GraphQLInt },
        },
        resolve: dashboardQueryService.getUsers
    },

    companiesList: {
        type: new GraphQLObjectType({
            name: 'paginatedCompanyResponse',
            fields: {
                data: { type: new GraphQLList(companyType) },
                size: { type: GraphQLInt },
                page: { type: GraphQLInt },
                count: { type: GraphQLInt },
            }
        }),
        args: {
            authorization: { type: new GraphQLNonNull(GraphQLString) },
            size: { type: GraphQLInt },
            page: { type: GraphQLInt },
        },
        resolve: dashboardQueryService.getCompanies
    }
}