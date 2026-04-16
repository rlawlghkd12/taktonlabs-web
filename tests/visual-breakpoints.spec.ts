import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'wide', width: 1920, height: 1080 },
];

test.describe('반응형 풀샷', () => {
  for (const vp of viewports) {
    test(`${vp.name} (${vp.width}×${vp.height}) 풀페이지 렌더`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: vp });
      const page = await context.newPage();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(`${vp.name}-full.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
      });
      await context.close();
    });
  }
});
