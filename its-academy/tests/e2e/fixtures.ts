import { test as base, expect } from "@playwright/test";

/** 取り消せない操作の前に出る確認 (window.confirm) を、テストでは「OK」で進める */
export const test = base.extend({
  page: async ({ page }, use) => {
    page.on("dialog", (d) => void d.accept().catch(() => {}));
    await use(page);
  },
});

export { expect };
export type { Page } from "@playwright/test";
