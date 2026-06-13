import { config } from "./config.js";
import { Request, Response } from "express";

export async function handlerReset(_: Request, res: Response) {
  config.fileserverHits = 0;
  res.send('Reset');
};