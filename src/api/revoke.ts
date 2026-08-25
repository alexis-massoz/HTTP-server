import { Request, Response } from "express";
import { getBearerToken } from "../auth.js";
import { revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { respondWithJSON } from "./json.js";


export async function handlerRevoke(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  res.status(204).send();
}