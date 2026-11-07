"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { CmsState } from "@/app/actions/cms";
import { FormMessage } from "@/components/form-message";

/**
 * レッスン編集画面の「最後の操作の結果」。公開・予約などの後に、保存のときの古いメッセージ
 * (「下書きを保存しました」) が残って、画面が食い違った内容を表示しないようにする。
 * 操作のたびに番号を進め、最新の番号を持つメッセージだけを表示する。
 */
let seq = 0;
let notice: { seq: number; lessonId: string; state: CmsState } | null = null;
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** 新しい操作の番号を取る (エディタの保存で使う。取った番号のメッセージだけが表示される) */
export function nextNoticeSeq(): number {
  seq += 1;
  listeners.forEach((fn) => fn());
  return seq;
}

/** 公開の操作 (今すぐ公開・予約・予約の取り消し・版を戻して公開) の結果を、画面の上部に表示する */
export function announce(lessonId: string, state: CmsState) {
  notice = { seq: seq + 1, lessonId, state };
  nextNoticeSeq();
}

export function useNoticeSeq(): number {
  return useSyncExternalStore(subscribe, () => seq, () => 0);
}

/**
 * 編集フォームを最新の内容で読み直すため、ページを再読み込みしてから結果を表示する
 * (版から下書きを作る・版を戻して公開する の後)。結果は URL に付けて渡し、表示したら URL から消す。
 */
const NOTICE_PARAM = "cmsNotice";
type ReloadNotice = { kind: "restored"; from: number; to: number } | { kind: "republished"; version: number };
export function reloadWithNotice(n: ReloadNotice) {
  const url = new URL(window.location.href);
  url.searchParams.set(NOTICE_PARAM, n.kind === "restored" ? `restored-${n.from}-${n.to}` : `republished-${n.version}`);
  window.location.replace(url);
}

/** URL に入れるのは種類と版の番号だけ (外から作った URL で、任意の文章を「結果」として表示させないため) */
function noticeMessage(value: string): string | null {
  const restored = /^restored-(\d{1,6})-(\d{1,6})$/.exec(value);
  if (restored) return `版 ${restored[1]} の内容で下書き (版 ${restored[2]}) を作りました。編集して保存・公開できます。`;
  const republished = /^republished-(\d{1,6})$/.exec(value);
  if (republished) return `版 ${republished[1]} を公開しました。受講生の画面がこの版に切り替わりました。`;
  return null;
}

/** 画面を移動しても前の結果が残らないよう、そのレッスンの結果だけを表示する */
export function CmsNotice({ lessonId }: { lessonId: string }) {
  const current = useNoticeSeq();
  useEffect(() => {
    const url = new URL(window.location.href);
    const value = url.searchParams.get(NOTICE_PARAM);
    if (value === null) return;
    url.searchParams.delete(NOTICE_PARAM);
    window.history.replaceState(window.history.state, "", url); // もう一度再読み込みしたときに、同じ結果を出さない
    const message = noticeMessage(value);
    if (message) announce(lessonId, { ok: message });
  }, [lessonId]);
  return <FormMessage state={notice && notice.seq === current && notice.lessonId === lessonId ? notice.state : undefined} />;
}
