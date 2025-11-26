import { GraphQLFloat, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import mongoose from "mongoose";
import { AccountModel } from "../../../entities/account/account-model";
import { IdempotencyKeyModel } from "../../../entities/idempotency-key/idempotency-key-model";
import { TransactionModel } from "../../../entities/transaction/transaction-model";
import { UserModel } from "../../../entities/user/user-model";

type CreateTransactionMutationInput = {
  amount: number;
  cpf: string;
  description: string;
};

const CreateTransactionMutation = mutationWithClientMutationId({
  name: 'CreateTransactionMutation',
  inputFields: {
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    cpf: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  },
  outputFields: {
    transactionId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload: { transactionId: string }) => payload.transactionId,
    },
  },
  mutateAndGetPayload: async (
    { amount, cpf, description }: CreateTransactionMutationInput,
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

      const targetUser = await UserModel.findOne({ cpf }).session(session);

      if (!targetUser) {
        throw new Error("Target user not found");
      }

      const idempotencyKeyExists = await IdempotencyKeyModel.findOne({
        hashedKey: idempotencyKey.hashedKey,
      }).session(session);

      if (idempotencyKeyExists) {
        throw new Error("Idempotency key already exists");
      }

      const userAccount = await AccountModel.findOne({ user: user._id }).session(session);

      if (!userAccount) {
        throw new Error("User account not found");
      }

      const targetAccount = await AccountModel.findOne({ user: targetUser._id }).session(session);

      if (!targetAccount) {
        throw new Error("Target user account not found");
      }

      if (userAccount.balance < amount) {
        throw new Error("Saldo insuficiente");
      }

      const transaction = await new TransactionModel({
        accountId: userAccount.id,
        targetAccountId: targetAccount.id,
        idempotencyKey: idempotencyKey,
        amount,
        description,
        date: new Date(),
      }).save({ session });

      await session.commitTransaction();

      return { transactionId: transaction._id.toString() };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },
});

export { CreateTransactionMutation };
