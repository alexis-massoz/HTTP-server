import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, UserForbiddenError, NotFoundError, UserNotAuthenticatedError } from "./errors.js";

export function middlewareLogResponses(
    req: Request, 
    res: Response, 
    next: NextFunction,
) {
    res.on("finish", () => {
    console.log(`${res.statusCode} ${req.method} ${req.url}`);
  });
    next();
};

export function middlewareMetrics(
    _:Request, 
    __: Response, 
    next: NextFunction,
) {
    config.api.fileserverHits += 1;
    next();
};

export function middlewareErrorHandling(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    let statusCode = 500;
    let message = "Something went wrong on our end";
    
    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    };
    if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    }
    if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    }
    if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }
    if (statusCode >= 500) {
        console.log(err.message);
    }
    respondWithError(res, statusCode, message);    
}