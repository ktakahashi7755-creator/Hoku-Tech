/**
 * X-Forwarded-For から利用者の IP を選ぶ (純粋関数)。
 *
 * 利用者は X-Forwarded-For に任意の値を書いて送れるため、先頭の値は信用できない。
 * HTTPS を終端するプロキシやロードバランサーは、受け取った接続元を末尾に追記する。
 * そのため、信頼できるプロキシの段数 (hops) だけ末尾から数えた値を使う。
 *
 * hops が未設定 (null) のときは IP を記録しない。どの値も利用者が自由に書けるため
 * (本番・検証環境では TRUSTED_PROXY_HOPS の設定を起動時に必須にしている)。
 */
export function pickClientIp(forwardedFor: string | null, hops: number | null): string | null {
  if (hops === null) return null;
  const entries = (forwardedFor ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  // 段数より少ない値しかない場合は、信頼できる値がないので記録しない
  const ip = entries.length >= hops ? entries[entries.length - hops] : null;
  // IP として不自然な値 (長すぎる・記号を含む) は記録しない
  return ip && /^[0-9a-fA-F.:]{2,45}$/.test(ip) ? ip : null;
}

/** TRUSTED_PROXY_HOPS を読む。1 以上の整数でなければ null (未設定扱い) */
export function parseProxyHops(value: string | undefined): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) return null;
  return Number(value);
}
