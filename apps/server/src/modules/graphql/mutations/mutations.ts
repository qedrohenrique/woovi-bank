import { GraphQLObjectType } from "graphql";
import { AuthMutations } from "./authorization";

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutations",
  fields: () => ({
    ...AuthMutations,
  }),
});