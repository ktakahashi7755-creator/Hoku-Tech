/**
 * X-Forwarded-For から利用者の IP を選ぶ (純粋関数)。
 *
 * 利用者は X-Forwarded-For に任意の値を書いて送れるため、先頭の値は信用できない。
 * HTTPS を終端するプロキシやロードバランサーは、受け取った接続元を末尾に追記する。
 * そのため、信頼できるプロキシの段数 (hops) だけ末尾から数えた値を使う。
 *
 * hops が未設定 (null) のときは先頭の値を使う (プロキシなしのローカル実行向け。本番では TRUSTED_PROXY_HOPS を設定する)。
 */
export function pickClientIp(forwardedFor: string | null, realIp: string | null, hops: number | null): string | null {
  const entries = (forwardedFor ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  if (hops !== null) {
    // 段数より少ない値しかない場合は、信頼できる値がないので記録しない
    return entries.length >= hops ? entries[entries.length - hops] : null;
  }
  return entries[0] || realIp || null;
}

/** TRUSTED_PROXY_HOPS を読む。1 以上の整数でなければ null (未設定扱い) */
export function parseProxyHops(value: string | undefined): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) return null;
  return Number(value);
}
