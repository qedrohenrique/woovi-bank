import { GraphQLObjectType } from "graphql";
import { AuthMutations } from "./authorization";
import { IdempotencyMutations } from "./idempotency";
import { TransactionMutations } from "./transaction";

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutations",
  fields: () => ({
    ...AuthMutations,
    ...IdempotencyMutations,
    ...TransactionMutations,
  }),
});