import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { AccountModel } from "../../../entities/account/account-model";
import { TransactionModel } from "../../../entities/transaction/transaction-model";
import { UserModel } from "../../../entities/user/user-model";

const TransactionType = new GraphQLObjectType({
  name: "Transaction",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (transaction) => transaction._id.toString(),
    },
    idempotencyKey: {
      type: GraphQLString,
      resolve: (transaction) => transaction.idempotencyKey,
    },
    accountId: {
      type: GraphQLString,
      resolve: (transaction) => transaction.accountId,
    },
    targetAccountId: {
      type: GraphQLString,
      resolve: (transaction) => transaction.targetAccountId,
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (transaction) => transaction.amount,
    },
    description: {
      type: GraphQLString,
      resolve: (transaction) => transaction.description,
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (transaction) => transaction.date.toISOString(),
    },
    targetUserCpf: {
      type: GraphQLString,
      resolve: async (transaction) => {
        if (!transaction.targetAccountId) return null;
        try {
          const account = await AccountModel.findById(transaction.targetAccountId);
          if (!account || !account.user) return null;
          const user = await UserModel.findById(account.user);
          return user?.cpf || null;
        } catch {
          return null;
        }
      },
    },
    accountUserCpf: {
      type: GraphQLString,
      resolve: async (transaction) => {
        if (!transaction.accountId) return null;
        try {
          const account = await AccountModel.findById(transaction.accountId);
          if (!account || !account.user) return null;
          const user = await UserModel.findById(account.user);
          return user?.cpf || null;
        } catch {
          return null;
        }
      },
    },
  }),
});

export const TransactionsQuery = {
  type: new GraphQLNonNull(new GraphQLList(TransactionType)),
  description: "Get all transactions for the authenticated user",
  resolve: async (_: any, __: any, ctx: any) => {
    const { user } = ctx;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const account = await AccountModel.findOne({ user: user._id });
    if (!account) {
      return [];
    }
    const accountId = (account._id as any).toString();
    const transactions = await TransactionModel.find({
      $or: [
        { accountId: accountId },
        { targetAccountId: accountId },
      ],
    })
      .sort({ date: -1 })
      .limit(100);
    return transactions;
  },
};
