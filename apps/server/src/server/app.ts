import cors from 'kcors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import routes from './routes';

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

app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
