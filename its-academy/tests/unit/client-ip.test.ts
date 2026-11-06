import { describe, expect, it } from "vitest";
import { parseProxyHops, pickClientIp } from "@/lib/client-ip";

describe("pickClientIp", () => {
  it("段数を指定すると、利用者が書き足した先頭の値ではなく末尾から数えた値を使う", () => {
    expect(pickClientIp("6.6.6.6, 203.0.113.5", 1)).toBe("203.0.113.5");
    expect(pickClientIp("6.6.6.6, 203.0.113.5, 10.0.0.2", 2)).toBe("203.0.113.5");
    expect(pickClientIp("2001:db8::1", 1)).toBe("2001:db8::1");
  });
  it("値が段数より少ない・IP として不自然なら記録しない", () => {
    expect(pickClientIp("203.0.113.5", 2)).toBeNull();
    expect(pickClientIp(null, 1)).toBeNull();
    expect(pickClientIp("<script>", 1)).toBeNull();
  });
  it("段数が未設定なら、利用者が自由に書ける値は使わない", () => {
    expect(pickClientIp("203.0.113.5, 10.0.0.2", null)).toBeNull();
  });
});

describe("parseProxyHops", () => {
  it("1 以上の整数だけを受け付ける", () => {
    expect(parseProxyHops("1")).toBe(1);
    expect(parseProxyHops("2")).toBe(2);
    for (const v of [undefined, "", "0", "-1", "1.5", "abc"]) expect(parseProxyHops(v)).toBeNull();
  });
});
