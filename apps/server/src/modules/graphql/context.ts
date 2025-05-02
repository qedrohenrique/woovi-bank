import { UserDocument } from "../entities/user/UserModel";
import { ParameterizedContext } from "koa";
import { getDataloaders } from "../loaders/loaderRegister";

interface ContextVars {
  ctx?: ParameterizedContext;
  user?: UserDocument;
}

export const getContext = ({ ctx, user }: ContextVars) => {
  const dataloaders = getDataloaders();

  return {
    ctx,
    dataloaders,
    user,
  } as const;
};