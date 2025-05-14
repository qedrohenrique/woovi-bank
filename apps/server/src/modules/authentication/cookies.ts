import { Context, ParameterizedContext } from "koa";
import { UserModel } from "../entities/user/user-model";
import { env } from "../../config/environment";
import jwt from "jsonwebtoken";

export const setAuthTokenCookie = (ctx: Context, token: string) => {
  ctx.cookies.set("bankinho.auth.token", token, {
    domain: "localhost",
    httpOnly: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const validateJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_KEY);
    return decoded as { subId: string };
  } catch {
    throw new Error("Invalid token.");
  }
};

export const getContextUser = async (ctx: ParameterizedContext) => {
  const token = ctx.cookies.get("bankinho.auth.token");

  try {
    const { subId } = validateJwt(token as string);

    const user = await UserModel.findById(subId);
    return { user };
  } catch {
    return {
      user: undefined,
    };
  }
};