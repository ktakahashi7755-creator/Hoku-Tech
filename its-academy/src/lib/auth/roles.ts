import type { Role } from "@prisma/client";

export const STAFF_ROLES: readonly Role[] = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"];
export const ADMIN_ROLES: readonly Role[] = ["SUPER_ADMIN", "ADMIN"];

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "システム管理者",
  ADMIN: "管理者",
  INSTRUCTOR: "講師",
  STUDENT: "受講生",
};

export function isStaff(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function isAdmin(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}

/**
 * 受講生の個人データを閲覧できるか。
 * - 本人
 * - 管理者 (ADMIN / SUPER_ADMIN)
 * - その受講生の担当講師
 */
export function canViewStudent(
  viewer: { id: string; role: Role },
  studentId: string,
  assignedInstructorIds: readonly string[],
): boolean {
  if (viewer.id === studentId) return true;
  if (isAdmin(viewer.role)) return true;
  if (viewer.role === "INSTRUCTOR") return assignedInstructorIds.includes(viewer.id);
  return false;
}

/** ロールを付与・変更できるか。自分より上位、または同格のロールは付与できない (SUPER_ADMIN を除く) */
export function canAssignRole(actor: Role, target: Role): boolean {
  if (actor === "SUPER_ADMIN") return true;
  if (actor === "ADMIN") return target === "INSTRUCTOR" || target === "STUDENT";
  return false;
}
