import { test as base, expect } from "@playwright/test";

/** 取り消せない操作の前に出る確認 (window.confirm) を、テストでは「OK」で進める */
export const test = base.extend({
  // Playwright の fixture の引数名 (use) が React のフック名と同じため、別名で受け取る
  page: async ({ page }, provide) => {
    page.on("dialog", (d) => void d.accept().catch(() => {}));
    await provide(page);
  },
});

export { expect };
export type { Page } from "@playwright/test";
