import { UserModel } from "../modules/entities/user/user-model";
import { CreateUserBody } from "./types";
import { env } from "../config/environment";
import { sign } from "jsonwebtoken";
import Router from 'koa-router';
import { ParameterizedContext } from "koa";
import { graphqlHTTP } from "koa-graphql";
import { getContextUser } from "../modules/authentication/cookies";
import { schema } from "../modules/graphql";
import { getContext } from "../modules/graphql/context";

const routes = new Router();

routes.all(
  "/graphql",
  graphqlHTTP(async (_, __, ctx: ParameterizedContext) => {
    const { user } = await getContextUser(ctx);

    return {
      graphiql: true,
      schema,
      pretty: true,

      context: await getContext({
        ctx,
        user: user || undefined,
      }),
    };
  })
);

routes.all("/healthcheck", async (ctx) => {
  ctx.status = 200;
})

export default routes;