import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";
import { UserNotAuthenticatedError } from "../../api/errors.js";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function validateRefreshToken(refreshToken: string) {
  const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken));
  if (!result) {
    throw new UserNotAuthenticatedError("Refresh token not found");
  }
  if (result.expiresAt < new Date()) {
    throw new UserNotAuthenticatedError("Refresh token expired");
  }
  if (result.revokedAt) {
    throw new UserNotAuthenticatedError("Refresh token revoked");
  }
  return result.userId;
}


export async function revokeRefreshToken(refreshToken: string) {
  await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.token, refreshToken));
}
