import { describe, expect, it } from "vitest";
import { isEditableDraft } from "@/lib/content/versions";
import { strugglingAssignments, weakLessons } from "@/lib/progress/guidance";
import { reachableAssignments } from "@/lib/progress/metrics";

describe("isEditableDraft", () => {
  const lesson = { currentVersionId: "v1", scheduledVersionId: "v2" };
  it("未公開で、公開中・予約中でない版だけ上書きできる", () => {
    expect(isEditableDraft({ id: "v3", publishedAt: null }, lesson)).toBe(true);
  });
  it("公開済み・公開中・予約中の版は上書きしない", () => {
    expect(isEditableDraft({ id: "v3", publishedAt: new Date() }, lesson)).toBe(false);
    expect(isEditableDraft({ id: "v1", publishedAt: null }, lesson)).toBe(false);
    expect(isEditableDraft({ id: "v2", publishedAt: null }, lesson)).toBe(false);
  });
});

describe("strugglingAssignments", () => {
  it("修正依頼・不合格・2 回以上提出を対象にし、合格済みは何回目でも対象にしない", () => {
    const list = [
      { id: "a", latestStatus: "CHANGES_REQUESTED", attempts: 1 },
      { id: "b", latestStatus: "FAILED", attempts: 1 },
      { id: "c", latestStatus: "RESUBMITTED", attempts: 2 },
      { id: "d", latestStatus: "PASSED", attempts: 2 },
      { id: "e", latestStatus: "SUBMITTED", attempts: 1 },
      { id: "f", latestStatus: null, attempts: 0 },
    ];
    expect(strugglingAssignments(list).map((a) => a.id)).toEqual(["a", "b", "c"]);
  });
});

describe("weakLessons", () => {
  it("受けたが一度も合格していない必修レッスンだけ", () => {
    const lessons = [
      { id: "l1", optional: false },
      { id: "l2", optional: false },
      { id: "l3", optional: true },
      { id: "l4", optional: false },
    ];
    const attempted = new Set(["l1", "l2", "l3"]);
    const passed = new Set(["l2"]);
    expect(weakLessons(lessons, attempted, passed).map((l) => l.id)).toEqual(["l1"]);
  });
});

describe("reachableAssignments", () => {
  it("前提レッスンが非公開の課題は外す (前提レッスンがない課題は残す)", () => {
    const list = [
      { id: "a", lessonId: "published" },
      { id: "b", lessonId: "hidden" },
      { id: "c", lessonId: null },
    ];
    expect(reachableAssignments(list, new Set(["published"])).map((a) => a.id)).toEqual(["a", "c"]);
  });
});
