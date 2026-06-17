import { deleteAllUsers } from "../db/queries/users.js";
import { config } from "./config.js";
import { Request, Response } from "express";
import { respondWithError } from "./json.js";

export async function handlerReset(_: Request, res: Response) {
  if (config.api.platform !== "dev") {
    respondWithError(res, 403, "Forbidden");
  };
  deleteAllUsers();
  config.api.fileserverHits = 0;
  res.send('Reset');
};