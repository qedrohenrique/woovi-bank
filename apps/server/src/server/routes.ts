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

routes.get("/users/:id", async (ctx) => {
  const user = await UserModel.findById(ctx.params.id);
  ctx.body = user;
});

routes.post("/register", async (ctx) => {
  try {
    const { fullName, email, cpf, password } = ctx.request.body as CreateUserBody;

    if (!fullName || !email || !cpf || !password) {
      ctx.status = 400;
      ctx.body = { message: "Campos obrigatórios não informados." };
      return;
    }

    const user = await UserModel.create({
      fullName,
      email,
      cpf,
      password,
    });

    ctx.status = 201;
    ctx.body = user;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: "Erro ao criar usuário." };
  }
});

routes.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body as CreateUserBody;
  const user = await UserModel.findOne({ email });

  if (!user || !(await user.comparePassword(password, user.password))) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid username or password' };
    return;
  }

  const token = sign({ email }, env.JWT_KEY, { expiresIn: '1h' });
  ctx.body = { token };
});

export default routes;