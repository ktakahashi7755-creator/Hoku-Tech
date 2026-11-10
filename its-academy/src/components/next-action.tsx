import type { NextAction } from "@/lib/progress/metrics";
import { ButtonLink } from "./ui";
import { Icon } from "./icons";

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
    // 画面でいちばん目立たせる場所。濃い青の地に白い文字 (6.9:1 以上)。フォーカスの枠も白にして見分けられるようにする
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-strong to-accent p-6 text-white shadow-raised sm:p-8 [&_:focus-visible]:outline-white">
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 size-64 rounded-full bg-white/5" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
            <Icon name="play" className="size-4" />
            次にやること
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-white/90">{body}</p>
        </div>
        <ButtonLink href={href} variant="inverse" className="shrink-0 self-start sm:self-center">
          {cta}
          <Icon name="arrowRight" className="size-4" />
        </ButtonLink>
      </div>
    </section>
  );
}
