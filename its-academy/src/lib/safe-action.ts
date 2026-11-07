import { unstable_rethrow } from "next/navigation";

export const NETWORK_ERROR = "送信できませんでした。通信を確認して、もう一度お試しください (入力した内容は画面に残っています)。";

/**
 * useActionState に渡すサーバーアクションを包み、通信の失敗をフォームのエラーとして返す。
 * 包まないと、失敗が画面全体のエラー表示になり、入力した内容 (提出のコード・採点のコメントなど) が消えてしまう。
 * Next.js が内部で使う例外 (redirect・notFound など) は、そのまま投げ直す。
 */
export function withNetworkFallback<S>(action: (prev: S, formData: FormData) => Promise<S>, fallback: NonNullable<S>) {
  return async (prev: S, formData: FormData): Promise<S> => {
    try {
      return await action(prev, formData);
    } catch (e) {
      unstable_rethrow(e);
      return fallback;
    }
  };
}
