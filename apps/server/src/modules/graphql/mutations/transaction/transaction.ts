import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";

import { mutationWithClientMutationId } from "graphql-relay";

const CreateTransactionMutation = mutationWithClientMutationId({
  name: 'CreateTransactionMutation',
  inputFields: {
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    targetUserId: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    transactionId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload) => payload.transactionId,
    },
  },
  mutateAndGetPayload: async (input) => {
    // const transaction = await TransactionModel.create(input);
    // return transaction;
  },
});
