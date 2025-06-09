import { randomUUID } from "crypto";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { IdempotencyKeyModel } from "../../../entities/idempotency-key/idempotency-key-model";
import { setIdempotencyKeyCookie } from "../../../authentication/cookies";
const CreateIdempotencyKeyMutation = mutationWithClientMutationId({
  name: 'CreateIdempotencyKeyMutation',
  inputFields: {},
  outputFields: {
    key: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async (
    _,
    ctx
  ) => {
    const keyId = randomUUID();
    const { user } = ctx;

    if (!user) {
      throw new Error("User not found");
    }

    const idempotencyKey = await IdempotencyKeyModel.create({
      keyId,
      payload: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
      createdAt: new Date(),
    });

    setIdempotencyKeyCookie(ctx.ctx, idempotencyKey.hashedKey);

    return { key: idempotencyKey.hashedKey };
  },
});

export { CreateIdempotencyKeyMutation };
