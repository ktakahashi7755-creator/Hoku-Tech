import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/auth/next-path";

describe("safeNextPath", () => {
  it("アプリの中のパスだけを戻り先にする", () => {
    expect(safeNextPath("/lessons/l2-methods")).toBe("/lessons/l2-methods");
    expect(safeNextPath("/admin/reviews?view=changes")).toBe("/admin/reviews?view=changes");
  });
  it("外部サイト・ログイン画面・API・CSV 出力・不正な値は使わない", () => {
    for (const v of ["https://evil.example", "//evil.example", "/\\\\evil.example", "/login", "/login?next=/home", "/api/health", "/admin/export/students.csv", "javascript:alert(1)", "/a<script>", null, 1, "/" + "a".repeat(400)]) {
      expect(safeNextPath(v)).toBeNull();
    }
  });
});
