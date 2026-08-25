import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError, UserForbiddenError, UserNotAuthenticatedError } from "./errors.js";
import { createChirp, getChirp, getChirps, deleteChirp } from "../db/queries/chirps.js";
import { chirps, NewChirp } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "./config.js";

export async function handlerChirps(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);
  type parameters = {
    body: string;
  };
  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
   };

  const words = params.body.split(" ");

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned = words.join(" ");
  
  const newChirp: NewChirp = {
      body: cleaned,
      userId: userId,
  };

  const result = await createChirp(newChirp);

  respondWithJSON(res, 201, {
    id: result.id,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    body: result.body,
    userId: result.userId,
  });
};

export async function handlerChirpsRetrieve(_: Request, res: Response) {
  let authorId = "";
  let authorIdQuery = _.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }

  let sort = "";
  let sortQuery = _.query.sort;
  if (typeof sortQuery === "string") {
    sort = sortQuery;
  }

  const result = await getChirps(authorId);
  if (sort === "desc") {
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  respondWithJSON(res, 200, result);
  return;
}

export async function handlerChirpRetrieve(req:Request, res: Response) {
  const { chirpId } = req.params;
  if (typeof chirpId !== "string") {
    respondWithError(res, 404, "Chirp ID incorrect");
    return;
  }
  const chirp = await getChirp(chirpId);
  if (chirp.length !== 0) {
    respondWithJSON(res, 200, chirp[0]);
    return;
  };
  respondWithError(res, 404, "Chirp not found");
  return;
};
  

export async function handlerChirpsDelete(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);
  
  const { chirpId } = req.params;
  if (typeof chirpId !== "string") {
    respondWithError(res, 404, "Chirp ID incorrect");
    return;
  }
  const chirp = await getChirp(chirpId);
  if (chirp.length === 0) {
    respondWithError(res, 404, "Chirp not found");
    return;
  }
  if (chirp[0].userId !== userId) {
    throw new UserForbiddenError("You are not authorized to delete this chirp");
  }
  await deleteChirp(chirpId);
  respondWithJSON(res, 204, { message: "Chirp deleted successfully" }); 
}
  