import { Request, Response } from "express";
import { createUser, getUser, UserResponse } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithJSON, respondWithError } from "./json.js";
import { hashPassword, checkPasswordHash } from "./auth.js";

export async function handlerUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
  };
  
  const params: Parameters = req.body;
  const hashedPassword = await hashPassword(params.password);
  const newUser: NewUser = {
    email: params.email,
    hashedPassword: hashedPassword
  }
  const result: UserResponse = await createUser(newUser);
  respondWithJSON(res, 201, {
    email: result.email,
    id: result.id,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt
  });
  return;
}

export async function handlerLogin(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
  };
  const params: Parameters = req.body;

  try {
    const user = await getUser(params.email);
    if (user.length === 0) {
      respondWithError(res, 401, "incorrect email or password");
      return;
    };
    const result = await checkPasswordHash(params.password, user[0].hashedPassword);  
    if (result) {
      respondWithJSON(res, 200, {
        email: user[0].email,
        id: user[0].id,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt
      });
      return;
    } else {
      respondWithError(res, 401, "incorrect email or password");
      return;
    } 
  } catch (error) {
    respondWithError(res, 401, "incorrect email or password");
  }
};


  
  
