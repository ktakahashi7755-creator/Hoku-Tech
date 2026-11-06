import type { Role } from "@prisma/client";
import { ADMIN_ROLES, STAFF_ROLES } from "./roles";

/** パスごとに必要なロール。上から順に判定し、最初に一致したものを使う */
const RULES: { prefix: string; roles: readonly Role[] }[] = [
  { prefix: "/admin/content", roles: ADMIN_ROLES },
  { prefix: "/admin/settings", roles: ADMIN_ROLES },
  { prefix: "/admin/students/new", roles: ADMIN_ROLES },
  { prefix: "/admin", roles: STAFF_ROLES },
];

export function requiredRoles(pathname: string): readonly Role[] | null {
  const rule = RULES.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/"));
  return rule?.roles ?? null;
}
