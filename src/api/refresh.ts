import { Request, Response } from "express";
import { getBearerToken } from "../auth.js";
import { validateRefreshToken } from "../db/queries/refreshTokens.js";
import { makeJWT } from "../auth.js";
import { config } from "./config.js";
import { respondWithJSON } from "./json.js";

export async function handlerRefresh(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  const userId = await validateRefreshToken(refreshToken);
  const accessToken = makeJWT(userId, 3600, config.jwt.secret);
  respondWithJSON(res, 200, {
    token: accessToken,
  });
}

