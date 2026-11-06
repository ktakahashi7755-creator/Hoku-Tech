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

import { GITHUB_REPO_URL } from "@/lib/validation";

describe("GITHUB_REPO_URL", () => {
  it("GitHub のリポジトリ URL だけを許可する", () => {
    expect(GITHUB_REPO_URL.test("https://github.com/hanako/its-profile")).toBe(true);
    expect(GITHUB_REPO_URL.test("https://github.com/hanako/its-profile/")).toBe(true);
    expect(GITHUB_REPO_URL.test("http://github.com/hanako/its-profile")).toBe(false);
    expect(GITHUB_REPO_URL.test("https://evil.example/hanako/repo")).toBe(false);
    expect(GITHUB_REPO_URL.test("javascript:alert(1)//github.com/a/b")).toBe(false);
    expect(GITHUB_REPO_URL.test("https://github.com/hanako")).toBe(false);
  });
});

import { submitsRepository } from "@/lib/validation";

describe("submitsRepository", () => {
  it("リポジトリ提出の形式を判定する", () => {
    expect(submitsRepository("GITHUB_REPO")).toBe(true);
    expect(submitsRepository("FINAL_PROJECT")).toBe(true);
    expect(submitsRepository("PROJECT")).toBe(true);
    expect(submitsRepository("CODE")).toBe(false);
    expect(submitsRepository("WRITTEN")).toBe(false);
  });
});

import { requiredRoles } from "@/lib/auth/proxy-rules";

describe("requiredRoles (描画前のロール確認)", () => {
  it("教材管理・設定・受講生追加は管理者のみ", () => {
    expect(requiredRoles("/admin/content")).toEqual(["SUPER_ADMIN", "ADMIN"]);
    expect(requiredRoles("/admin/content/lessons/abc")).toEqual(["SUPER_ADMIN", "ADMIN"]);
    expect(requiredRoles("/admin/settings")).toEqual(["SUPER_ADMIN", "ADMIN"]);
    expect(requiredRoles("/admin/students/new")).toEqual(["SUPER_ADMIN", "ADMIN"]);
  });
  it("それ以外の /admin は講師以上", () => {
    expect(requiredRoles("/admin")).toEqual(["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"]);
    expect(requiredRoles("/admin/students/abc")).toEqual(["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"]);
  });
  it("前方一致の取り違えをしない (/administrator は対象外)", () => {
    expect(requiredRoles("/administrator")).toBeNull();
    expect(requiredRoles("/home")).toBeNull();
  });
});

import { canManageAccount } from "@/lib/auth/roles";

describe("canManageAccount (アカウント管理の範囲)", () => {
  it("自分自身は操作できない", () => {
    expect(canManageAccount({ id: "a", role: "SUPER_ADMIN" }, { id: "a", role: "SUPER_ADMIN" })).toBe(false);
  });
  it("ADMIN は講師・受講生を操作でき、他の ADMIN / SUPER_ADMIN は操作できない", () => {
    expect(canManageAccount({ id: "a", role: "ADMIN" }, { id: "s", role: "STUDENT" })).toBe(true);
    expect(canManageAccount({ id: "a", role: "ADMIN" }, { id: "i", role: "INSTRUCTOR" })).toBe(true);
    expect(canManageAccount({ id: "a", role: "ADMIN" }, { id: "b", role: "ADMIN" })).toBe(false);
    expect(canManageAccount({ id: "a", role: "ADMIN" }, { id: "x", role: "SUPER_ADMIN" })).toBe(false);
  });
  it("SUPER_ADMIN は自分以外を操作できる。講師は操作できない", () => {
    expect(canManageAccount({ id: "x", role: "SUPER_ADMIN" }, { id: "b", role: "ADMIN" })).toBe(true);
    expect(canManageAccount({ id: "i", role: "INSTRUCTOR" }, { id: "s", role: "STUDENT" })).toBe(false);
  });
});
