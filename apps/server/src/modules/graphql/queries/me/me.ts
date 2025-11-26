import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

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
