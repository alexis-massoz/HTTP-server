import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

export function middlewareLogResponses (req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
    console.log(`${res.statusCode} ${req.method} ${req.url}`);
  });
    next();
};

export function middlewareMetrics (req :Request, res: Response, next: NextFunction) {
    config.fileserverHits += 1;
    next();
};