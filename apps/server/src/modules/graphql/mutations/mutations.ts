import { GraphQLObjectType } from "graphql";
import { AuthMutations } from "./auth-mutations";

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutations",
  fields: () => ({
    ...AuthMutations,
  }),
});