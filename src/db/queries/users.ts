import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";


export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export async function getUser(userEmail: string) {
  return db.select().from(users).where(eq(users.email, userEmail));
}