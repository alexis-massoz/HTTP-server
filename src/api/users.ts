import type { Request, Response } from "express";

import { createUser, updateUser, upgradeUser } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { NewUser } from "../db/schema.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "./config.js";
import { getAPIKey } from "./auth.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };
  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}


export async function handlerUpdate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };
  const params: parameters = req.body;

  const accessToken = getBearerToken(req);
  const userId = validateJWT(accessToken, config.jwt.secret);

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);     
  const user = await updateUser(userId, params.email, hashedPassword);
  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}
  
export async function handlerPolkaWebhooks(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    };
  };
  const params: parameters = req.body;
  const APIKey = getAPIKey(req);
  if (APIKey !== config.api.polkaKey) {
    throw new UserNotAuthenticatedError("Invalid API key");
  }

  if (params.event !== "user.upgraded") {
    res.status(204).send();
    return;
  }

  const userId = params.data.userId;    
  await upgradeUser(userId);
  res.status(204).send();

}