import { GraphQLObjectType, GraphQLString } from "graphql";
import { TransactionsQuery } from "./transaction/transaction";

export const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root queries",
  fields: () => ({
    healthCheck: {
      type: GraphQLString,
      resolve: () => 'ok',
    },
    transactions: TransactionsQuery,
  }),
});