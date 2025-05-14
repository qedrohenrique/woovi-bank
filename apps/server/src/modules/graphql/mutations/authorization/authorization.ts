import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { sign } from "jsonwebtoken";
import { env } from "process";
import { v4 as uuidv4 } from "uuid";
import { NotFoundException } from "../../../common/errors/not-found-exception";
import { UnauthorizedException } from "../../../common/errors/unauthorized-exception";
import { addHours } from "../../../common/utils/time";
import { UserModel } from "../../../entities/user/user-model";

export type LoginMutationInput = {
  email: string;
  password: string;
};

export type SendEmailVerificationMutationInput = {
  email: string;
};

const LoginMutation = mutationWithClientMutationId({
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

const SendEmailVerificationMutation = mutationWithClientMutationId({
  name: "SendEmailVerificationMutation",
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: { type: GraphQLBoolean },
  },
  mutateAndGetPayload: async ({ email }: SendEmailVerificationMutationInput) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException();
    }

    const token = uuidv4();

    await UserModel.updateOne({ email }, {
      $set: {
        emailVerificationToken: token,
        emailVerificationTokenExpiresAt: addHours(new Date(), 1),
      },
    });


    return { success: true };
  },
});

export { LoginMutation, SendEmailVerificationMutation };

