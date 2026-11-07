"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";

const Ids = z.array(z.cuid()).max(50);

/** 画面に表示したお知らせを既読にする (本人のものだけ。次に開いたときに「新着」の印が消える) */
export async function markNotificationsRead(rawIds: unknown): Promise<void> {
  const user = await requireUser(undefined, { allowPendingPasswordChange: true });
  const ids = Ids.parse(rawIds);
  if (ids.length === 0) return;
  await db.notification.updateMany({ where: { userId: user.id, id: { in: ids }, readAt: null }, data: { readAt: new Date() } });
}
