import cors from 'kcors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from 'koa-router';
import { UserModel } from '../modules/entities/user/UserModel';

const app = new Koa();

app.use(cors({ origin: '*' }));
app.use(logger());
app.use(
  bodyParser({
    onerror(err, ctx) {
      ctx.throw(err, 422);
    },
  })
);

const routes = new Router();

routes.get("/users", async (ctx) => {
  const users = await UserModel.find();
  ctx.body = users;
});

type CreateUserBody = {
  fullName: string;
  email: string;
  cpf: string;
  password: string;
};


routes.post("/users", async (ctx) => {
  try {
    const { fullName, email, cpf, password } = ctx.request.body as CreateUserBody;

    if (!fullName || !email || !cpf || !password) {
      ctx.status = 400;
      ctx.body = { message: "fullName, email, cpf e password são obrigatórios." };
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

app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
