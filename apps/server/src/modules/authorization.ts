import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { sign } from "jsonwebtoken";
import { env } from "process";
import { v4 as uuidv4 } from "uuid";
import { BadRequestException } from "./common/errors/bad-request-exception";
import { NotFoundException } from "./common/errors/not-found-exception";
import { UnauthorizedException } from "./common/errors/unauthorized-exception";
import { sendEmail } from "./common/utils/mailer/mailer";
import { UserConfirmationTemplate } from "./common/utils/mailer/templates/account-confirmation";
import { addHours } from "./common/utils/time";
import { UserModel } from "./entities/user/user-model";

export type LoginMutationInput = {
  email: string;
  password: string;
};

export type RegisterMutationInput = {
  fullName: string;
  email: string;
  cpf: string;
  password: string;
};

export type SendEmailVerificationMutationInput = {
  email: string;
};

export type ConfirmEmailMutationInput = {
  token: string;
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

const RegisterMutation = mutationWithClientMutationId({
  name: "RegisterMutation",
  inputFields: {
    fullName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    cpf: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: { type: GraphQLBoolean },
  },
  mutateAndGetPayload: async ({ fullName, email, cpf, password }: RegisterMutationInput) => {
    const token = uuidv4();

    await UserModel.create({
      fullName,
      email,
      cpf,
      password,
      emailVerificationToken: token,
      emailVerificationTokenExpiresAt: addHours(new Date(), 1),
    });

    await sendEmail({
      to: email,
      subject: "Confirme seu usuário na Bank",
      template: UserConfirmationTemplate,
      token,
      linkUri: `${env.FRONTEND_URL}/confirm-email`,
    });

    return { success: true };
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
    const token = uuidv4();

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          emailVerificationToken: token,
          emailVerificationTokenExpiresAt: addHours(new Date(), 1),
        },
      },
      { new: true }
    );

    if (!user) {
      throw new NotFoundException();
    }

    await sendEmail({
      to: email,
      subject: "Confirme seu usuário na Bank",
      template: UserConfirmationTemplate,
      token,
      linkUri: `${env.FRONTEND_URL}/confirm-email`,
    });

    return { success: true };
  },
});

const ConfirmEmailMutation = mutationWithClientMutationId({
  name: "ConfirmEmailMutation",
  inputFields: {
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    success: { type: GraphQLBoolean },
  },
  mutateAndGetPayload: async ({ token }: ConfirmEmailMutationInput) => {
    const user = await UserModel.findOne({ emailVerificationToken: token });

    if (!user) {
      throw new NotFoundException();
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Email já verificado.");
    }

    if (user.emailVerificationTokenExpiresAt < new Date()) {
      throw new BadRequestException("Token expirado.");
    }

    await UserModel.updateOne({
      $set: {
        isEmailVerified: true,
      },
    });

    return { success: true };
  },
});

export { ConfirmEmailMutation, LoginMutation, RegisterMutation, SendEmailVerificationMutation };

