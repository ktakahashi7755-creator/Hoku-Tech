import type { Metrics } from "@/lib/progress/metrics";
import { Stat } from "./ui";

const show = (v: number | null) => (v === null ? "未評価" : `${v} 点`);

/** 指標 A〜E を分けて表示する (混ぜた総合点は作らない) */
export function MetricCards({ metrics }: { metrics: Metrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Stat label="A 教材履修率" value={`${metrics.lessonCompletion}%`} hint={`必修 ${metrics.completedLessons} / ${metrics.totalLessons} レッスン (理解度チェック合格後に完了。L8 選択は含めない)`} />
      <Stat label="B 課題完了率" value={`${metrics.assignmentCompletion}%`} hint={`必修 ${metrics.passedAssignments} / ${metrics.totalAssignments} 課題が合格 (L8 選択は含めない)`} />
      <Stat label="C 理解度評価" value={show(metrics.comprehension)} hint="理解度チェックの最高点の平均 (100 点満点)" />
      <Stat label="D 実装能力評価" value={show(metrics.implementation)} hint="コード課題の最新採点の平均 (講師採点)" />
      <Stat label="E 実務準備状況" value={show(metrics.workReadiness)} hint="講師のスキル評価 (1〜5) を 100 点換算" />
    </div>
  );
}
