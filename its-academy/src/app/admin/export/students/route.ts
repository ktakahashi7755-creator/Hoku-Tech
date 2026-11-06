import { requireUser } from "@/lib/auth/dal";
import { STAFF_ROLES } from "@/lib/auth/roles";
import { audit } from "@/lib/audit";
import { listStudentOverviews } from "@/lib/queries/staff";
import { toCsv } from "@/lib/csv";
import { jstDayKey } from "@/lib/progress/metrics";

/** 受講生の進捗 CSV。講師は担当の受講生のみ出力される */
export async function GET() {
  const viewer = await requireUser(STAFF_ROLES);
  const rows = await listStudentOverviews(viewer);
  const header = [
    "ユーザー ID", "氏名", "所属", "担当講師", "入校日", "学習開始日", "目標修了日", "現在の学習領域", "現在のレッスン",
    "A 教材履修率", "B 課題完了率", "C 理解度評価", "D 実装能力評価", "E 実務準備状況",
    "完了レッスン数", "合格課題数", "累計学習分", "連続学習日数", "最終学習日", "学習停滞の可能性", "レビュー待ち件数",
  ];
  const body = rows.map((r) => [
    r.student.id, r.student.name, r.student.affiliation, r.enrollment.instructor?.name,
    r.student.joinedAt ? jstDayKey(r.student.joinedAt) : "", jstDayKey(r.enrollment.startedAt),
    r.enrollment.targetEndDate ? jstDayKey(r.enrollment.targetEndDate) : "",
    r.current?.level ?? "", r.current?.title ?? "",
    r.metrics.lessonCompletion, r.metrics.assignmentCompletion, r.metrics.comprehension ?? "", r.metrics.implementation ?? "", r.metrics.workReadiness ?? "",
    r.metrics.completedLessons, r.metrics.passedAssignments, r.totalMinutes, r.streak,
    r.lastActivity ? jstDayKey(r.lastActivity) : "", r.stagnant ? "はい" : "いいえ", r.pendingReviews,
  ]);
  await audit({ actorId: viewer.id, action: "export.students_csv", metadata: { rows: body.length } });
  return new Response(toCsv([header, ...body]), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="students-${jstDayKey(new Date())}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
