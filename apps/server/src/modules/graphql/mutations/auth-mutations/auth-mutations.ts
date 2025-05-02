import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { env } from "process";
import { UserModel } from "../../../entities/user/UserModel";
import { sign } from "jsonwebtoken";
import { UnauthorizedException } from "../../../errors/unauthorized-exception";

export type LoginMutationInput = {
  email: string;
  password: string;
};

export const LoginMutation = mutationWithClientMutationId({
  name: "LoginMutation",
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    token: { type: GraphQLString },
  },
  mutateAndGetPayload: async ({ email, password }: LoginMutationInput) => {
    const user = await UserModel.findOne({ email });

    if (!user || await user.comparePassword(password, user.password)) {
      throw new UnauthorizedException();
    }

    const token = sign({ email }, env.JWT_KEY, { expiresIn: '1h' });

    return { token };
  },
});
