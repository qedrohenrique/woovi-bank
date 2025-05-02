import { GraphQLObjectType, GraphQLString } from "graphql";

export const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root queries",
  fields: () => ({
    healthCheck: {
      type: GraphQLString,
      resolve: () => 'ok',
    } ,
  }),
});