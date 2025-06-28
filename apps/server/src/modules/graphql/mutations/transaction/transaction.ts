import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import mongoose from "mongoose";
import { IdempotencyKeyModel } from "../../../entities/idempotency-key/idempotency-key-model";
import { TransactionModel } from "../../../entities/transaction/transaction-model";
import { AccountModel } from "../../../entities/account/account-model";

type CreateTransactionMutationInput = {
  amount: number;
  targetUserId: string;
  description: string;
};

const CreateTransactionMutation = mutationWithClientMutationId({
  name: 'CreateTransactionMutation',
  inputFields: {
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    targetUserId: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  },
  outputFields: {
    transactionId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload) => payload.transactionId,
    },
  },
  mutateAndGetPayload: async (
    { amount, targetUserId, description }: CreateTransactionMutationInput,
    ctx
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { idempotencyKey, user } = ctx;

      if (!user) {
        throw new Error("User not found");
      }

      if (!idempotencyKey) {
        throw new Error("Idempotency key not found");
      }

      const idempotencyKeyExists = await IdempotencyKeyModel.findOne({
        hashedKey: idempotencyKey.hashedKey,
      });

      if (idempotencyKeyExists) {
        throw new Error("Idempotency key already exists");
      }

      const transaction = await new TransactionModel({
        accountId: user._id.toString(),
        targetAccountId: targetUserId,
        idempotencyKey: idempotencyKey,
        amount,
        description,
        date: new Date(),
      }).save();

      await AccountModel.findByIdAndUpdate(targetUserId, {
        $inc: { balance: amount },
      });

      await AccountModel.findByIdAndUpdate(user._id.toString(), {
        $inc: { balance: -amount },
      });

      await session.commitTransaction();

      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },
});

export { CreateTransactionMutation };
