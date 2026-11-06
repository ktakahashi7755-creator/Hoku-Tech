import "server-only";
import { db } from "@/lib/db";

export const DEFAULT_STAGNATION_DAYS = 7;

export async function getStagnationThreshold(): Promise<number> {
  const row = await db.setting.findUnique({ where: { key: "stagnationThresholdDays" } });
  const v = typeof row?.value === "number" ? row.value : DEFAULT_STAGNATION_DAYS;
  return Number.isInteger(v) && v > 0 ? v : DEFAULT_STAGNATION_DAYS;
}
