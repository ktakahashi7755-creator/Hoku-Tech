import type { NextAction } from "@/lib/progress/metrics";
import { ButtonLink, Card } from "./ui";

export function NextActionCard({ next, assignmentSlugs, firstTime = false }: { next: NextAction; assignmentSlugs: Record<string, string>; firstTime?: boolean }) {
  let title = "";
  let body = "";
  let href = "";
  let cta = "";
  switch (next.kind) {
    case "fix_submission":
      title = `修正依頼: ${next.title}`;
      body = "講師からのコメントを確認して、修正版を再提出しましょう。";
      href = `/assignments/${assignmentSlugs[next.assignmentId]}`;
      cta = "コメントを確認する";
      break;
    case "lesson":
      title = next.title;
      body = next.resume ? "前回の続きから再開できます。" : firstTime ? "最初のレッスンから始めましょう。学び方と質問の仕方を確認します。" : "次のレッスンに進みましょう。";
      href = `/lessons/${next.slug}`;
      cta = next.resume ? "続きから学習する" : "レッスンを始める";
      break;
    case "assignment":
      title = `課題: ${next.title}`;
      body = "前提のレッスンが終わりました。課題に取り組みましょう。";
      href = `/assignments/${assignmentSlugs[next.assignmentId]}`;
      cta = "課題を開く";
      break;
    case "awaiting_review":
      title = "講師のレビュー待ちです";
      body = `${next.count} 件の提出がレビュー待ちです。結果が出るまで、これまでのレッスンを復習しましょう。`;
      href = "/assignments";
      cta = "提出状況を見る";
      break;
    case "done":
      title = "公開中の教材をすべて終えました";
      body = "次の教材が公開されるとここに表示されます。講師に次のステップを相談しましょう。";
      href = "/progress";
      cta = "学習進捗を見る";
      break;
  }
  return (
    <Card tone="accent">
      <p className="text-sm font-semibold text-accent-strong">次にやること</p>
      <h2 className="mt-1 text-xl font-bold">{title}</h2>
      <p className="mt-1 text-muted">{body}</p>
      <ButtonLink href={href} className="mt-4">
        {cta}
      </ButtonLink>
    </Card>
  );
}
