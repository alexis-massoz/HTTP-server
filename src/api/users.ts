import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";

export async function handlerUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
  };
  const params: Parameters = req.body;
  const newUser: NewUser = {
    email: params.email
  }
  const result = await createUser(newUser);
  respondWithJSON(res, 201, {
    id: result.id,
    email: result.email,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  });
  return;
}