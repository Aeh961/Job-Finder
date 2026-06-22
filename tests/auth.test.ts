import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { hashPassword } from "@/lib/auth";

describe("auth utilities", () => {
  it("hashes passwords with bcrypt", async () => {
    const hash = await hashPassword("password123");
    expect(hash).not.toBe("password123");
    await expect(bcrypt.compare("password123", hash)).resolves.toBe(true);
    await expect(bcrypt.compare("wrong-password", hash)).resolves.toBe(false);
  });
});
