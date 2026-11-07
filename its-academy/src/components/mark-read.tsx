"use client";

import { useEffect } from "react";
import { markNotificationsRead } from "@/app/actions/notifications";

/** 表示した未読のお知らせを既読にする (この表示では「新着」の印を残し、次に開いたときに消える) */
export function MarkRead({ ids }: { ids: string[] }) {
  const key = ids.join(",");
  useEffect(() => {
    if (key) markNotificationsRead(key.split(",")).catch(() => {});
  }, [key]);
  return null;
}
