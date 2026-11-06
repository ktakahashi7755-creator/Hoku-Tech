import { describe, expect, it } from "vitest";
import { generateSessionToken, hashSessionToken } from "@/lib/auth/token";

describe("session token", () => {
  it("十分な長さのランダム値で、毎回異なる", () => {
    const a = generateSessionToken();
    expect(a.length).toBeGreaterThanOrEqual(43);
    expect(a).not.toBe(generateSessionToken());
  });
  it("保存用ハッシュは決定的で、元のトークンを含まない", () => {
    const t = generateSessionToken();
    expect(hashSessionToken(t)).toBe(hashSessionToken(t));
    expect(hashSessionToken(t)).not.toContain(t);
  });
});
