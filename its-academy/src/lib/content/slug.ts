import { z } from "zod";

/** URL 名 (レッスン・課題の slug)。半角英小文字・数字をハイフンでつなぐ */
export function slugSchema(example: string) {
  return z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, `URL 名は半角英小文字・数字・ハイフンで入力してください (例: ${example})`)
    .max(60);
}
