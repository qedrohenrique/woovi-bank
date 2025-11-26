import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { AccountModel } from "../../../entities/account/account-model";

const MeType = new GraphQLObjectType({
  name: "Me",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user._id.toString(),
    },
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.fullName,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.email,
    },
    cpf: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.cpf,
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: async (user) => {
        const account = await AccountModel.findOne({ user: user._id });
        return account?.balance ?? 0;
      },
    },
  }),
});

export const MeQuery = {
  type: MeType,
  description: "Get the authenticated user",
  resolve: (_: any, __: any, ctx: any) => {
    const { user } = ctx;
    return user || null;
  },
};
