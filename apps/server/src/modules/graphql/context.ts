import { UserDocument } from "../entities/user/user-model";
import { ParameterizedContext } from "koa";
import { getDataloaders } from "../loaders/loaderRegister";

interface ContextVars {
  ctx?: ParameterizedContext;
  user?: UserDocument;
  idempotencyKey?: string;
}

export const getContext = ({ ctx, user, idempotencyKey }: ContextVars) => {
  const dataloaders = getDataloaders();

  return {
    ctx,
    dataloaders,
    user,
    idempotencyKey,
  } as const;
};