import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UserNotAuthenticatedError } from "./api/errors.js";
import { randomBytes } from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    if (await argon2.verify(hash, password)) {
        return true;
    } else {
        return false;
    }
}   

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string) {
   const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
   }
   return jwt.sign(payload, secret);
};

export function validateJWT(tokenString: string, secret: string) {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  if (decoded.iss !== "chirpy") {
    throw new UserNotAuthenticatedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request) {
    const header = req.get('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
        throw new UserNotAuthenticatedError('No token found');
    }
    return header.split(' ')[1];
}

export function makeRefreshToken() {
  return randomBytes(32).toString('hex');
}
