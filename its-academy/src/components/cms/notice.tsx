"use client";

import { useSyncExternalStore } from "react";
import type { CmsState } from "@/app/actions/cms";
import { FormMessage } from "@/components/form-message";

/**
 * レッスン編集画面の「最後の操作の結果」。公開・予約などの後に、保存のときの古いメッセージ
 * (「下書きを保存しました」) が残って、画面が食い違った内容を表示しないようにする。
 * 操作のたびに番号を進め、最新の番号を持つメッセージだけを表示する。
 */
let seq = 0;
let notice: { seq: number; state: CmsState } | null = null;
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
export function announce(state: CmsState) {
  notice = { seq: seq + 1, state };
  nextNoticeSeq();
}

export function useNoticeSeq(): number {
  return useSyncExternalStore(subscribe, () => seq, () => 0);
}

export function CmsNotice() {
  const current = useNoticeSeq();
  return <FormMessage state={notice && notice.seq === current ? notice.state : undefined} />;
}
