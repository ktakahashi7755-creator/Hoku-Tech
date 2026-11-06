import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "@/lib/csv";

describe("csv", () => {
  it("カンマ・改行・引用符をエスケープする", () => {
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("1\n2")).toBe('"1\n2"');
  });
  it("数式として解釈される値を無害化する (CSV インジェクション対策)", () => {
    expect(csvCell("=HYPERLINK(\"http://x\")")).toBe("\"'=HYPERLINK(\"\"http://x\"\")\"");
    expect(csvCell("+1")).toBe("'+1");
    expect(csvCell("@SUM(A1)")).toBe("'@SUM(A1)");
  });
  it("null は空欄、BOM と CRLF を付ける", () => {
    expect(toCsv([["a", null]])).toBe("﻿a,\r\n");
  });
});
