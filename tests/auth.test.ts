import { describe, it, expect, beforeAll, vi, afterAll, beforeEach } from "vitest";
import { makeJWT, validateJWT } from "../src/auth.js"

describe("JWT creation", () => {
    const userID = "Id 123";
    const expiresIn = 2;
    const secret = "secret";
    const badSecret = "badSecret";
    let token: string;

    beforeAll(async () => {
        vi.useFakeTimers();
        token = makeJWT(userID, expiresIn, secret);
    });

    beforeEach(async () => {
        vi.clearAllTimers();
    });

    afterAll(async () => {
        vi.useRealTimers();
    });

    it("should return true for the created JWT", async () => {
        const result = validateJWT(token, secret);
        expect(result).toBe(userID);
    });

    it("should throw error for expired token", async () => {
        vi.advanceTimersByTime(2000);
        expect(() => validateJWT(token, secret)).toThrow(new Error('Invalid or expired token'),
    );
    });

    it("should throw error for wrong secret", async () => {
        expect(() => validateJWT(token, badSecret)).toThrow(new Error('Invalid or expired token'),
    );
    });
});