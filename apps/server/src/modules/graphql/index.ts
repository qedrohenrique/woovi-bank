import { GraphQLSchema } from "graphql";
import { Mutation } from "./mutations/mutations";
import { Query } from "./queries/queries";

export const schema = new GraphQLSchema({
  mutation: Mutation,
  query: Query,
});