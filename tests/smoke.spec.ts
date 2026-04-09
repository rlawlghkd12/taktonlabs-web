import { test, expect } from '@playwright/test';

test.describe('Taktonlabs 랜딩 스모크', () => {
  test('페이지 로드 & 콘솔 에러 없음', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/Taktonlabs/);
    await page.waitForLoadState('networkidle');

    // 스크롤 애니메이션 초기화 대기
    await page.waitForTimeout(1000);

    expect(consoleErrors).toEqual([]);
  });

  test('모든 섹션이 렌더링됨', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#capabilities')).toBeVisible();
    await expect(page.locator('#products')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('헤드라인이 올바르게 표시됨', async ({ page }) => {
    await page.goto('/');
    const headline = page.locator('.headline');
    await expect(headline).toContainText('제품을');
    await expect(headline).toContainText('만듭니다');
    await expect(headline).toContainText('끝까지');
  });

  test('Nav 앵커 클릭 → 해당 섹션으로 스크롤', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.click('a[href="#contact"]');
    await page.waitForTimeout(1500); // Lenis 스크롤 대기

    const contactSection = page.locator('#contact');
    const box = await contactSection.boundingBox();
    expect(box).not.toBeNull();
    // 뷰포트 상단 근처에 contact 섹션이 있는지
    expect(box!.y).toBeLessThan(200);
  });

  test('문의 폼 필수 필드 검증', async ({ page }) => {
    await page.goto('/');

    // 필수 필드 비운 상태로 제출
    await page.click('button[type="submit"]');

    // HTML5 validation이 차단해야 함
    const nameInput = page.locator('#contact-name');
    const validity = await nameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(validity).toBe(false);
  });

  test('문의 폼 정상 제출 (mocked)', async ({ page }) => {
    // Web3Forms API 요청 모킹
    await page.route('**/api.web3forms.com/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Form submitted successfully' }),
      });
    });

    await page.goto('/');
    await page.fill('#contact-name', '테스트 사용자');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-message', '테스트 메시지입니다.');
    await page.click('button[type="submit"]');

    await expect(page.locator('[data-success-state]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-success-state]')).toContainText('연락드리겠습니다');
  });

  test('prefers-reduced-motion 시 콘텐츠 즉시 표시', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero 단어가 애니메이션 없이 즉시 보여야 함
    const firstWord = page.locator('.word').first();
    const opacity = await firstWord.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBe(1);

    await context.close();
  });
});
