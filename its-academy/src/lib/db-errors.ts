import { Prisma } from "@prisma/client";

/** 一意制約の違反 (同じ値が同時に登録された場合など) */
export function isUniqueViolation(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

/** 外部キーの違反 (参照先が削除された・存在しない場合) */
export function isMissingReference(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && (e.code === "P2003" || e.code === "P2025");
}
