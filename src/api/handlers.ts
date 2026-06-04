import { APIConfig, config } from "./config.js"
import type { NextFunction, Request, Response } from "express";

export async function handlerRequests(_: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits: ${config.fileserverHits}`);
};

export async function handlerReset(_: Request, res: Response) {
  config.fileserverHits = 0;
  res.send('Reset');
};