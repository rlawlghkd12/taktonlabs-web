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

  test('Hero 재디자인 렌더링', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('.headline')).toContainText('제품을 만듭니다.');
    await expect(hero.locator('.headline')).toContainText('끝까지');
    await expect(hero.locator('.hero-wordmark')).toBeVisible();
    await expect(hero.locator('.hero-wordmark')).toContainText('TAKTON');
    await expect(hero.locator('.cta-primary')).toContainText('제품 둘러보기');
    await expect(hero.locator('.hero-est')).toContainText('EST. 2024');
    // 구버전 글로우 오브 제거 확인
    await expect(hero.locator('.glow-orb')).toHaveCount(0);
  });

  test('Now shipping 마이크로 링크 → Products로 스크롤', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('.hero-now-shipping');
    await page.waitForFunction(
      () => {
        const products = document.querySelector('#products');
        if (!products) return false;
        return products.getBoundingClientRect().top < 200;
      },
      { timeout: 5000 }
    );
  });

  test('Nav 앵커 클릭 → 해당 섹션으로 스크롤', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.click('a[href="#contact"]');
    // Lenis 스크롤 (데스크톱) 또는 네이티브 smooth scroll (모바일) 완료 대기
    await page.waitForFunction(
      () => {
        const contact = document.querySelector('#contact');
        if (!contact) return false;
        const box = contact.getBoundingClientRect();
        return box.top < 200;
      },
      { timeout: 5000 }
    );

    const contactSection = page.locator('#contact');
    const box = await contactSection.boundingBox();
    expect(box).not.toBeNull();
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

// GitHub API mock — 테스트 rate limit 회피 + 결정적 동작
const MOCK_RELEASE = {
  tag_name: 'v0.6.1',
  published_at: '2026-04-09T00:29:59Z',
  assets: [
    {
      name: 'TutorMate-0.6.1-universal.dmg',
      browser_download_url:
        'https://github.com/rlawlghkd12/tutomate/releases/download/v0.6.1/TutorMate-0.6.1-universal.dmg',
    },
    {
      name: 'TutorMate-Setup-0.6.1.exe',
      browser_download_url:
        'https://github.com/rlawlghkd12/tutomate/releases/download/v0.6.1/TutorMate-Setup-0.6.1.exe',
    },
    {
      name: 'TutorMate-Q-0.6.1-universal-mac.dmg',
      browser_download_url:
        'https://github.com/rlawlghkd12/tutomate/releases/download/v0.6.1/TutorMate-Q-0.6.1-universal-mac.dmg',
    },
    {
      name: 'TutorMate-Q-Setup-0.6.1.exe',
      browser_download_url:
        'https://github.com/rlawlghkd12/tutomate/releases/download/v0.6.1/TutorMate-Q-Setup-0.6.1.exe',
    },
  ],
};

async function mockGithubApi(page: import('@playwright/test').Page): Promise<void> {
  await page.route(
    'https://api.github.com/repos/rlawlghkd12/tutomate/releases/latest',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_RELEASE),
      });
    }
  );
}

test.describe('TutorMate 기본 버전 다운로드 페이지', () => {
  test('/tutomate 페이지 로드 & 콘솔 에러 없음', async ({ page }) => {
    await mockGithubApi(page);
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/tutomate');
    await expect(page).toHaveTitle(/TutorMate.*Taktonlabs/);
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toEqual([]);
  });

  test('TutorMate 제품명, 태그라인, 다운로드 버튼 렌더링', async ({ page }) => {
    await page.goto('/tutomate');
    await expect(page.locator('h1.name')).toContainText('TutorMate');
    await expect(page.locator('h1.name')).not.toContainText('Q');
    await expect(page.locator('.tagline')).toBeVisible();
    await expect(page.locator('[data-platform="mac"]')).toBeVisible();
    await expect(page.locator('[data-platform="windows"]')).toBeVisible();
  });

  test('regular 다운로드 URL이 올바른 파일명 사용', async ({ page }) => {
    await page.goto('/tutomate');
    const macHref = await page
      .locator('[data-platform="mac"]')
      .getAttribute('href');
    const winHref = await page
      .locator('[data-platform="windows"]')
      .getAttribute('href');
    // 동적(explicit tag) 또는 fallback(latest) 둘 다 허용
    expect(macHref).toMatch(
      /^https:\/\/github\.com\/rlawlghkd12\/tutomate\/releases\/(latest\/download|download\/v\d+\.\d+\.\d+)\/TutorMate-\d+\.\d+\.\d+-universal\.dmg$/
    );
    expect(winHref).toMatch(
      /^https:\/\/github\.com\/rlawlghkd12\/tutomate\/releases\/(latest\/download|download\/v\d+\.\d+\.\d+)\/TutorMate-Setup-\d+\.\d+\.\d+\.exe$/
    );
    // Q 파일명이 아님을 확인
    expect(macHref).not.toContain('TutorMate-Q');
    expect(winHref).not.toContain('TutorMate-Q');
  });

  test('홈 → Products "체험하기" → /tutomate 이동 가능', async ({ page }) => {
    await page.goto('/');
    const tutomateLink = page.locator('.product-card a[href="/tutomate"]');
    await expect(tutomateLink).toContainText('체험하기');
  });

  test('/tutomate → 홈 back link 동작', async ({ page }) => {
    await page.goto('/tutomate');
    const backLink = page.locator('.back-link');
    await expect(backLink).toHaveAttribute('href', '/');
    await expect(backLink).toContainText('Taktonlabs');
  });

  test('/tutomate → Q 버전 variant switch 동작', async ({ page }) => {
    await page.goto('/tutomate');
    const switchLink = page.locator('.variant-switch');
    await expect(switchLink).toHaveAttribute('href', '/tutomate/q');
    await expect(switchLink).toContainText('Q 버전');
  });

  test('시스템 요구사항 섹션 렌더링', async ({ page }) => {
    await page.goto('/tutomate');
    await expect(page.locator('.requirements-title')).toContainText(
      '시스템 요구사항'
    );
    await expect(page.locator('.req-item').first()).toContainText('macOS');
    await expect(page.locator('.req-item').nth(1)).toContainText('Windows');
  });
});

test.describe('TutorMate Q 다운로드 페이지', () => {
  test('/tutomate/q 페이지 로드 & 콘솔 에러 없음', async ({ page }) => {
    await mockGithubApi(page);
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/tutomate/q');
    await expect(page).toHaveTitle(/TutorMate Q.*Taktonlabs/);
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toEqual([]);
  });

  test('TutorMate Q 제품명 렌더링', async ({ page }) => {
    await page.goto('/tutomate/q');
    await expect(page.locator('h1.name')).toContainText('TutorMate Q');
  });

  test('Q 다운로드 URL이 Q 파일명 사용', async ({ page }) => {
    await page.goto('/tutomate/q');
    const macHref = await page
      .locator('[data-platform="mac"]')
      .getAttribute('href');
    const winHref = await page
      .locator('[data-platform="windows"]')
      .getAttribute('href');
    // 동적(explicit tag) 또는 fallback(latest) 둘 다 허용
    expect(macHref).toMatch(
      /^https:\/\/github\.com\/rlawlghkd12\/tutomate\/releases\/(latest\/download|download\/v\d+\.\d+\.\d+)\/TutorMate-Q-\d+\.\d+\.\d+-universal-mac\.dmg$/
    );
    expect(winHref).toMatch(
      /^https:\/\/github\.com\/rlawlghkd12\/tutomate\/releases\/(latest\/download|download\/v\d+\.\d+\.\d+)\/TutorMate-Q-Setup-\d+\.\d+\.\d+\.exe$/
    );
  });

  test('/tutomate/q → /tutomate variant switch 동작', async ({ page }) => {
    await page.goto('/tutomate/q');
    const switchLink = page.locator('.variant-switch');
    await expect(switchLink).toHaveAttribute('href', '/tutomate');
    await expect(switchLink).toContainText('기본 버전');
  });
});

test.describe('v2 신규 섹션', () => {
  test('Philosophy 재디자인 렌더링', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#philosophy');
    await expect(section).toBeVisible();
    await expect(section.locator('.phil-eyebrow')).toContainText('PHILOSOPHY');
    await expect(section.locator('.phil-headline')).toContainText('쓰이는 소프트웨어');
    await expect(section.locator('.phil-headline .highlight')).toContainText('오래 쓰이는');
    const principles = section.locator('[data-phil-principle]');
    await expect(principles).toHaveCount(3);
    await expect(principles.nth(0)).toContainText('ONE TEAM');
    await expect(principles.nth(1)).toContainText('IN THE FIELD');
    await expect(principles.nth(2)).toContainText('NO FRICTION LEFT');
  });

  test('Process 재디자인 — 세로 타임라인', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#process');
    await expect(section).toBeVisible();
    await expect(section.locator('.proc-headline')).toContainText('지름길은 없습니다');
    const rows = section.locator('[data-process-step]');
    await expect(rows).toHaveCount(4);
    await expect(rows.nth(0)).toContainText('DISCOVER');
    await expect(rows.nth(3)).toContainText('OPERATE');
    // 가로 스크롤 트랙 제거 확인
    await expect(section.locator('.hscroll-track')).toHaveCount(0);
  });

  test('Why 재디자인 — 2×2 그리드', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#why');
    await expect(section).toBeVisible();
    await expect(section.locator('.why-headline')).toContainText('네 가지 약속.');
    await expect(section.locator('.why-subcopy')).toContainText('우리가 반드시 지키는 네 가지');
    const cards = section.locator('[data-why-card]');
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toContainText('지속성');
    await expect(cards.nth(0)).toContainText('만든 사람이 끝까지');
    await expect(cards.nth(1)).toContainText('개방성');
    await expect(cards.nth(2)).toContainText('투명성');
    await expect(cards.nth(3)).toContainText('접근성');
  });

  test('FAQ 재디자인 — 아코디언 5개 + 헤드라인', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#faq .faq-headline')).toContainText('자주 받는 질문');
    const items = page.locator('[data-faq-item]');
    await expect(items).toHaveCount(5);
    const firstTrigger = items.nth(0).locator('[data-faq-trigger]');
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    await page.waitForTimeout(450);
  });

  test('Contact 재디자인 — 초대 + Direct 채널', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#contact');
    await expect(section).toBeVisible();
    await expect(section.locator('.contact-headline')).toContainText('프로젝트 이야기하러');
    await expect(section.locator('.contact-direct')).toContainText('hello@taktonlabs.com');
    await expect(section.locator('.contact-direct')).toContainText('@taktonlabs');
    await expect(section.locator('.contact-direct')).toContainText('양산');
    await expect(section.locator('.contact-direct')).toContainText('24h');
    // 폼
    await expect(section.locator('#contact-name')).toBeVisible();
    await expect(section.locator('#contact-email')).toBeVisible();
    await expect(section.locator('#contact-message')).toBeVisible();
  });

  test('FAQ JSON-LD FAQPage schema 존재', async ({ page }) => {
    await page.goto('/');
    const jsonLdScripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    const hasFaqPage = jsonLdScripts.some((content) => {
      try {
        const parsed = JSON.parse(content);
        return parsed['@type'] === 'FAQPage';
      } catch {
        return false;
      }
    });

    expect(hasFaqPage).toBe(true);
  });

  test('Product + Service schema 존재', async ({ page }) => {
    await page.goto('/');
    const jsonLdScripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    const types = jsonLdScripts
      .map((content) => {
        try {
          return JSON.parse(content)['@type'];
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    expect(types).toContain('Organization');
    expect(types).toContain('SoftwareApplication');
    expect(types).toContain('ProfessionalService');
    expect(types).toContain('FAQPage');
  });

  test('Geist 폰트 로드 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // document.fonts API 로 Geist family 확인
    const hasGeist = await page.evaluate(async () => {
      await document.fonts.ready;
      const fonts = Array.from(document.fonts);
      return fonts.some((f) => f.family.includes('Geist'));
    });

    expect(hasGeist).toBe(true);
  });
});
