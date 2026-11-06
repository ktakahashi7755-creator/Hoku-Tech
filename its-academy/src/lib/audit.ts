import "server-only";
import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { parseProxyHops, pickClientIp } from "@/lib/client-ip";

export async function clientIp(): Promise<string | null> {
  const h = await headers();
  return pickClientIp(h.get("x-forwarded-for"), h.get("x-real-ip"), parseProxyHops(process.env.TRUSTED_PROXY_HOPS));
}

/** 監査ログは追記のみ。個人情報やパスワードを metadata に入れないこと */
export async function audit(entry: {
  actorId: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await db.auditLog.create({ data: { ...entry, ip: await clientIp() } });
}
