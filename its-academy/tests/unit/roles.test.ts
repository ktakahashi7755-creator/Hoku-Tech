import { describe, expect, it } from "vitest";
import { canAssignRole, canViewStudent } from "@/lib/auth/roles";

describe("canViewStudent (個人データのアクセス分離)", () => {
  it("本人は閲覧できる", () => expect(canViewStudent({ id: "s1", role: "STUDENT" }, "s1", [])).toBe(true));
  it("他の受講生は閲覧できない", () => expect(canViewStudent({ id: "s2", role: "STUDENT" }, "s1", [])).toBe(false));
  it("担当講師は閲覧できる", () => expect(canViewStudent({ id: "i1", role: "INSTRUCTOR" }, "s1", ["i1"])).toBe(true));
  it("担当外の講師は閲覧できない", () => expect(canViewStudent({ id: "i2", role: "INSTRUCTOR" }, "s1", ["i1"])).toBe(false));
  it("管理者は閲覧できる", () => expect(canViewStudent({ id: "a1", role: "ADMIN" }, "s1", [])).toBe(true));
});

describe("canAssignRole", () => {
  it("ADMIN は ADMIN / SUPER_ADMIN を付与できない", () => {
    expect(canAssignRole("ADMIN", "ADMIN")).toBe(false);
    expect(canAssignRole("ADMIN", "SUPER_ADMIN")).toBe(false);
    expect(canAssignRole("ADMIN", "INSTRUCTOR")).toBe(true);
  });
  it("講師・受講生はロールを付与できない", () => {
    expect(canAssignRole("INSTRUCTOR", "STUDENT")).toBe(false);
    expect(canAssignRole("STUDENT", "STUDENT")).toBe(false);
  });
});
