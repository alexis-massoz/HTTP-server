import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UserNotAuthenticatedError } from "./errors.js";

import type { Request, Response } from "express";
import { config } from "./config.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
import { NewRefreshToken } from "../db/schema.js";

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UserNotAuthenticatedError("incorrect email or password");
  }

  const matching = await checkPasswordHash(
    params.password,
    user.hashedPassword,
  );
  if (!matching) {
    throw new UserNotAuthenticatedError("incorrect email or password");
  }

  const token = makeJWT(user.id, 3600, config.jwt.secret);
  const newRefreshToken: NewRefreshToken = {
    token: makeRefreshToken(),
    userId: user.id,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),// 60 days (days * hours * minutes * seconds * ms) 
    revokedAt: null,
  };
  const refreshToken = await createRefreshToken(newRefreshToken);


  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: token,
    refreshToken: refreshToken.token,
    isChirpyRed: user.isChirpyRed,
  });
}


export function getAPIKey(req: Request) {
  const header = req.get('Authorization')?.split(' ');
  if (!header || header[0] !== 'ApiKey' || !header[1]) {
    throw new UserNotAuthenticatedError('No API key found');
  }
  return header[1];
}
