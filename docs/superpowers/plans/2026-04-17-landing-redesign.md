# Taktonlabs 랜딩 페이지 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** taktonlabs.com 루트 페이지를 Quiet Kinetic 디자인(편집 디자인 + Apple 제품 페이지 DNA)으로 전면 리디자인한다. 9개 섹션 전체 교체, 2개 pinned scroll 인터랙션(Capabilities morph, Products screen-switch) 구현.

**Architecture:** 기존 Astro 6 + Tailwind v4 + GSAP + Lenis 스택 유지. 섹션별 컴포넌트 파일을 그대로 사용하되 내부를 재작성. 디자인 토큰을 `src/styles/tokens.css` 신설 파일로 분리. 두 개의 pinned 섹션은 전용 스크립트 모듈(`src/scripts/sections/`)로 분리. CustomCursor·ScrollProgress는 제거.

**Tech Stack:** Astro 6, Tailwind v4, GSAP (+ ScrollTrigger), Lenis, Pretendard, Playwright (테스트)

**참조 문서:** `docs/superpowers/specs/2026-04-17-landing-redesign-design.md`

---

## File Structure

**새 파일**
- `src/styles/tokens.css` — 색·타이포·모션·간격 디자인 토큰
- `src/lib/motion.ts` — 이징 커브 상수, reduced-motion 헬퍼, GSAP timeline 팩토리
- `src/data/capabilities.ts` — Capabilities 3 아이템 데이터 (현재 `.astro` 인라인 → 분리)
- `src/scripts/sections/capabilities-morph.ts` — Capabilities pinned BIG↔DOCK 타임라인
- `src/scripts/sections/products-scrub.ts` — Products pinned 3화면 전환 타임라인

**전면 재작성** (동일 경로 유지)
- `src/components/Hero.astro`
- `src/components/Philosophy.astro` (카드 레이아웃 제거, 풀폭 선언문으로)
- `src/components/Capabilities.astro` + `CapabilityCard.astro` (BIG+DOCK 듀얼 상태)
- `src/components/Process.astro` (가로 스크롤 제거, 세로 타임라인으로) + `ProcessStep.astro` (단순화)
- `src/components/WhyTakton.astro` + `WhyCard.astro` (아이콘 제거, 헤어라인 그리드)
- `src/components/Products.astro` + `ProductCard.astro` (pinned screen-switch)
- `src/components/Faq.astro` + `FaqItem.astro` (헤어라인 아코디언)
- `src/components/Contact.astro` + `ContactForm.astro` (80px 초대 + 밑줄 필드)
- `src/components/Footer.astro` (3칼럼 + 법적 한 줄)

**데이터 업데이트**
- `src/data/why.ts` — `iconName` 제거, `category` 추가

**삭제**
- `src/components/CustomCursor.astro`
- `src/components/ScrollProgress.astro`

**리팩터**
- `src/layouts/Base.astro` — CustomCursor/ScrollProgress import 제거, tokens.css import 추가
- `src/pages/index.astro` — 컴포넌트 import만 그대로, 렌더 순서 동일
- `src/styles/global.css` — 기존 레거시 토큰 정리, tokens.css import
- `src/scripts/scroll-animations.ts` — Hero·Philosophy·Process·Why·FAQ·Contact 진입 리빌, 과거 shimmer/float 로직 제거
- `src/scripts/interactive.ts` — 가로 스크롤(`hscroll`) 로직 제거
- `tests/smoke.spec.ts` — DOM 선택자 변경 반영, 새 섹션 assertion

---

## Global Conventions

- **작업 전 dev server 띄우기**: `pnpm dev` → http://localhost:4321
- **테스트 러너**: `pnpm test` (Playwright 전체) / `pnpm test --grep '<이름>'` (단일)
- **커밋 스타일**: 기존 로그에 맞춰 `feat:` / `fix:` / `docs:` / `refactor:` prefix + 한글 본문
- **각 태스크는 자체 커밋**으로 마무리 (사용자 feedback: 디버깅 중간 커밋 금지 → 태스크가 완결 상태면 커밋)
- **순서 의존**: Phase 0 → 1 → 2 → 3 순. Phase 1 내부는 병렬 가능. Phase 2는 Phase 0의 motion.ts 완성 필수.

---

## Phase 0 — Foundation

### Task 1: 디자인 토큰 CSS 신설

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/styles/global.css:1-10`

- [ ] **Step 1: tokens.css 작성**

```css
/* src/styles/tokens.css — Quiet Kinetic 디자인 토큰 */

:root {
  /* ===== Color ===== */
  --bg-primary: #fafaf7;          /* 오프화이트 — 대부분 섹션 */
  --bg-dark: #0a0a0a;             /* 근흑 — Products 섹션만 */
  --text-primary: #0a0a0a;
  --text-secondary: rgba(10, 10, 10, 0.7);
  --text-muted: rgba(10, 10, 10, 0.5);

  --hairline: rgba(10, 10, 10, 0.12);
  --hairline-strong: rgba(10, 10, 10, 0.15);
  --hairline-soft: rgba(10, 10, 10, 0.08);

  --accent-highlight: #fce38a;    /* Philosophy 키워드 하이라이트 */
  --accent-q-blue: #0055cc;       /* TutorMate Q 표기 */

  /* 다크 섹션 internal */
  --dark-text-primary: #fafaf7;
  --dark-text-secondary: rgba(250, 250, 247, 0.72);
  --dark-hairline: rgba(255, 255, 255, 0.12);

  /* ===== Typography ===== */
  --font-sans: 'Pretendard Variable', -apple-system, system-ui, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', 'Menlo', monospace;

  --tracking-headline: -0.045em;
  --tracking-title: -0.03em;
  --tracking-eyebrow: 0.25em;
  --tracking-mono-label: 0.2em;

  /* ===== Motion ===== */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-detail: cubic-bezier(0.4, 0, 0.6, 1);

  --dur-micro: 0.25s;
  --dur-block: 0.55s;
  --dur-morph-section: 1s;        /* scrub 구간 추가 보조용 */

  /* ===== Spacing ===== */
  --section-pad-y: 96px;
  --section-pad-x: 56px;
  --section-pad-y-lg: 160px;      /* ≥1536 */
  --section-pad-x-sm: 20px;       /* ≤768 */

  --container-wide: 1400px;
}
```

- [ ] **Step 2: global.css에서 tokens.css import**

`src/styles/global.css` 파일 최상단에 추가:
```css
@import './tokens.css';
```

- [ ] **Step 3: 빌드 검증**

Run: `pnpm build`
Expected: 에러 없이 완료. dist/ 생성됨.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css
git commit -m "feat(tokens): Quiet Kinetic 디자인 토큰 신설 — color·type·motion·spacing"
```

---

### Task 2: 모션 유틸리티 모듈

**Files:**
- Create: `src/lib/motion.ts`

- [ ] **Step 1: motion.ts 작성**

```ts
// src/lib/motion.ts
import type { gsap as GSAPType } from 'gsap';

/**
 * CSS custom property와 동일한 이징 커브.
 * GSAP 옵션 string 형태로 반환.
 */
export const EASE = {
  expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  detail: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

/**
 * reduced-motion 선호 여부. SSR-safe.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 뷰포트가 데스크톱 기준인지. pinned 인터랙션 분기용.
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(min-width: 768px)').matches;
}

/**
 * GSAP + ScrollTrigger 동적 import. 필요한 컴포넌트에서만 로드.
 */
export async function loadGsap(): Promise<{
  gsap: typeof GSAPType;
  ScrollTrigger: unknown;
}> {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
```

- [ ] **Step 2: 타입체크**

Run: `pnpm astro check`
Expected: 에러 없이 완료.

- [ ] **Step 3: Commit**

```bash
git add src/lib/motion.ts
git commit -m "feat(motion): 이징·reduced-motion·GSAP loader 유틸리티"
```

---

### Task 3: Base 레이아웃 정리

**Files:**
- Modify: `src/layouts/Base.astro` (CustomCursor/ScrollProgress import·사용 제거)

- [ ] **Step 1: Base.astro에서 두 컴포넌트 제거**

`src/layouts/Base.astro`를 열어 다음 변경:
- 상단 `import CustomCursor from ...` 및 `import ScrollProgress from ...` 제거 (없으면 패스 — 현재는 index.astro에서 import)
- 만약 `<CustomCursor />` 또는 `<ScrollProgress />` 태그가 있다면 제거

- [ ] **Step 2: index.astro에서 두 컴포넌트 제거**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Philosophy from '../components/Philosophy.astro';
import Capabilities from '../components/Capabilities.astro';
import Process from '../components/Process.astro';
import WhyTakton from '../components/WhyTakton.astro';
import Products from '../components/Products.astro';
import Faq from '../components/Faq.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<Base>
  <Nav />
  <main id="main">
    <Hero />
    <Philosophy />
    <Capabilities />
    <Process />
    <WhyTakton />
    <Products />
    <Faq />
    <Contact />
  </main>
  <Footer />
</Base>
```

(기존과 동일하되 `CustomCursor`, `ScrollProgress` import·사용 제거)

- [ ] **Step 3: 파일 삭제**

```bash
rm src/components/CustomCursor.astro src/components/ScrollProgress.astro
```

- [ ] **Step 4: dev 서버로 기존 페이지 렌더 확인**

Run: `pnpm dev` → 브라우저에서 http://localhost:4321 열기
Expected: 페이지 렌더됨(현재 디자인이지만 커스텀 커서·스크롤 프로그레스 없음). 콘솔 에러 없음.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: CustomCursor·ScrollProgress 제거, index.astro 정리"
```

---

### Task 4: Capabilities 데이터 분리

**Files:**
- Create: `src/data/capabilities.ts`
- Modify: `src/components/Capabilities.astro` (인라인 데이터 제거 후 import)

- [ ] **Step 1: capabilities.ts 작성**

```ts
// src/data/capabilities.ts

export type ProofType = 'browser' | 'native-window' | 'dashboard-tiles';

export interface Capability {
  index: '01' | '02' | '03';
  slug: string;              /* 'web' | 'desktop' | 'b2b' — 영문 라벨 */
  labelLatin: string;
  title: string;
  description: string;
  principles: string[];      /* em-dash 인라인 리스트 */
  proofType: ProofType;
}

export const capabilities: Capability[] = [
  {
    index: '01',
    slug: 'web',
    labelLatin: 'WEB · MOBILE',
    title: '웹 · 모바일 제품',
    description:
      '홈페이지, 예약 시스템, 관리 페이지. 기획부터 배포까지 한 팀에서. PC·태블릿·스마트폰 어디서든.',
    principles: ['반응형 웹', '예약 · 결제 연동', 'SEO 최적화'],
    proofType: 'browser',
  },
  {
    index: '02',
    slug: 'desktop',
    labelLatin: 'DESKTOP APP',
    title: '데스크톱 앱',
    description:
      'Windows와 macOS에서 동시에 작동. 자동 업데이트, 오프라인 지원. TutorMate가 이 방식으로 매일 운영 중.',
    principles: ['Electron 기반 크로스플랫폼', '자동 업데이트', '오프라인 동작'],
    proofType: 'native-window',
  },
  {
    index: '03',
    slug: 'b2b',
    labelLatin: 'B2B CUSTOM',
    title: 'B2B 맞춤 개발',
    description:
      '업무 흐름을 직접 보고 만듭니다. 엑셀 반복을 한 화면으로, 수작업을 자동으로.',
    principles: ['기존 데이터 이관', '대시보드', '자동화 · 리포트'],
    proofType: 'dashboard-tiles',
  },
];
```

- [ ] **Step 2: Capabilities.astro에서 import하도록 수정**

현재 Capabilities.astro 상단의 인라인 `const cards = [...]` 제거하고:
```astro
---
import CapabilityCard from './CapabilityCard.astro';
import { capabilities } from '../data/capabilities';
---
```

그리고 `cards.map(...)` → `capabilities.map(...)`로 변수명 변경.

- [ ] **Step 3: 타입체크·dev 서버 렌더 확인**

Run: `pnpm astro check && pnpm dev`
Expected: 에러 없음. Capabilities 섹션 기존 카드 3개 정상 렌더.

- [ ] **Step 4: Commit**

```bash
git add src/data/capabilities.ts src/components/Capabilities.astro
git commit -m "refactor(capabilities): 데이터를 data/capabilities.ts로 분리 + proofType 필드"
```

---

### Task 5: Why 데이터 갱신

**Files:**
- Modify: `src/data/why.ts`

- [ ] **Step 1: why.ts 업데이트**

```ts
// src/data/why.ts

export interface WhyPromise {
  index: '01' | '02' | '03' | '04';
  category: string;           /* '지속성' | '개방성' | '투명성' | '접근성' */
  title: string;
  body: string;
}

export const whyPromises: WhyPromise[] = [
  {
    index: '01',
    category: '지속성',
    title: '만든 사람이 끝까지 함께합니다',
    body: '기획한 사람, 설계한 사람, 코드를 짠 사람이 출시 후에도 같은 자리에 있습니다. 인수인계로 생기는 공백이 없습니다. 연락이 끊기는 일도 없습니다.',
  },
  {
    index: '02',
    category: '개방성',
    title: '데이터는 완전히 당신의 것',
    body: '엑셀, CSV 등 원하는 형식으로 언제든 내보낼 수 있습니다. 특정 플랫폼에 잠기지 않도록 설계부터 신경 씁니다.',
  },
  {
    index: '03',
    category: '투명성',
    title: '투명한 비용, 명확한 기준',
    body: '유지보수 방식과 비용은 프로젝트에 맞게 상담 후 결정합니다. 숨겨진 비용 없이, 사전에 합의한 범위 안에서 진행합니다.',
  },
  {
    index: '04',
    category: '접근성',
    title: '물어볼 곳이 있다는 안심',
    body: '사용 중 궁금한 점이 생기면 바로 연락할 수 있습니다. 매뉴얼만 던져주고 끝나는 게 아니라, 익숙해질 때까지 함께합니다.',
  },
];
```

(기존 `iconName` 필드 제거, `category` 추가.)

- [ ] **Step 2: WhyCard.astro의 iconName 참조 제거 준비**

현재 `WhyCard.astro`는 Phase 1에서 재작성 예정이므로, 지금은 타입 에러만 해결: WhyCard.astro 내 `promise.iconName` 참조를 일시 주석 처리 또는 optional chain으로 변경 (`promise.iconName ?? ''` 식).

- [ ] **Step 3: 빌드·타입체크**

Run: `pnpm astro check && pnpm build`
Expected: 에러 없음.

- [ ] **Step 4: Commit**

```bash
git add src/data/why.ts src/components/WhyCard.astro
git commit -m "refactor(why): iconName 제거 + category 필드 추가"
```

---

## Phase 1 — Typography-driven Sections

각 섹션은 동일 패턴: Playwright 테스트 작성 → 실패 확인 → 컴포넌트 재작성 → 통과 확인 → 커밋.

---

### Task 6: Hero — B 풀블리드 + 아웃라인 워드마크

**Files:**
- Modify: `src/components/Hero.astro` (전면 재작성)
- Modify: `tests/smoke.spec.ts` (Hero 관련 assertion 갱신)

**Design ref:** spec §4.1

- [ ] **Step 1: Playwright 테스트 먼저 수정**

`tests/smoke.spec.ts`에서 Hero 관련 테스트를 다음으로 갱신:
```ts
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
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `pnpm test --grep 'Hero 재디자인'`
Expected: FAIL ('.hero-wordmark' 없음).

- [ ] **Step 3: Hero.astro 재작성**

```astro
---
import { Icon } from 'astro-icon/components';
---
<section id="hero" class="hero">
  <div class="hero-wordmark" aria-hidden="true">TAKTON</div>
  <div class="hero-inner">
    <div class="hero-eyebrow">TAKTON LABS — SOFTWARE STUDIO · 양산</div>
    <h1 class="headline">
      <span class="word" data-word="0">제품을</span>
      <span class="word" data-word="1">만듭니다.</span>
      <span class="word word-muted" data-word="2">끝까지.</span>
    </h1>
    <p class="subcopy">
      웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오.<br />
      한 명의 사용자, 한 건의 데이터까지 놓치지 않는 탄탄한 시스템.
    </p>
    <div class="ctas">
      <a href="#products" class="cta cta-primary">
        <span>제품 둘러보기</span>
        <Icon name="lucide:arrow-right" width={18} height={18} />
      </a>
      <a href="#contact" class="cta cta-secondary"><span>문의하기</span></a>
    </div>
    <a href="#products" class="hero-now-shipping">
      Now shipping — <b>TutorMate</b> ↘
    </a>
    <div class="hero-est" aria-hidden="true">EST. 2024<br /><span>양산 · KR</span></div>
    <div class="hero-scroll-hint" aria-hidden="true">SCROLL ↓</div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding: 112px var(--section-pad-x) 144px;
    overflow: hidden;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 92vh;
    display: flex;
    align-items: center;
  }
  .hero-wordmark {
    position: absolute;
    right: -4vw; top: 6vh;
    font-size: clamp(180px, 28vw, 420px);
    font-weight: 800;
    letter-spacing: -0.08em;
    line-height: 0.8;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(10,10,10,0.07);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    will-change: transform;
  }
  .hero-inner { position: relative; max-width: var(--container-wide); margin: 0 auto; width: 100%; z-index: 1; }
  .hero-eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--text-muted);
    margin-bottom: 48px;
  }
  .headline {
    font-size: clamp(40px, 7.4vw, 84px);
    font-weight: 600;
    letter-spacing: var(--tracking-headline);
    line-height: 1.02;
    margin: 0 0 28px;
    color: var(--text-primary);
  }
  .word { display: inline-block; margin-right: 0.2em; }
  .word-muted { opacity: 0.3; display: block; }
  .subcopy {
    font-size: clamp(15px, 1.3vw, 17px);
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 560px;
    margin: 0 0 36px;
  }
  .ctas { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 48px; }
  .cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 22px; border-radius: 999px;
    font-size: 14px; font-weight: 500; text-decoration: none;
    transition: transform 0.25s var(--ease-smooth), background-color 0.25s var(--ease-smooth);
  }
  .cta-primary { background: var(--text-primary); color: var(--bg-primary); }
  .cta-primary:hover { transform: translateY(-2px); }
  .cta-secondary { background: transparent; color: var(--text-primary); opacity: 0.75; }
  .cta-secondary:hover { opacity: 1; }
  .hero-now-shipping {
    display: inline-block;
    font-size: 13px;
    color: var(--text-secondary);
    text-decoration: none;
    border-bottom: 1px solid var(--hairline);
    padding-bottom: 2px;
    transition: color 0.2s, border-color 0.2s;
  }
  .hero-now-shipping:hover { color: var(--text-primary); border-color: var(--text-primary); }
  .hero-now-shipping b { color: var(--text-primary); font-weight: 600; }
  .hero-est {
    position: absolute;
    right: 0; top: 0;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--text-muted);
    text-align: right;
    line-height: 1.7;
  }
  .hero-est span { opacity: 0.7; }
  .hero-scroll-hint {
    position: absolute;
    right: 0; bottom: -32px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--text-muted);
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .hero { padding: 80px var(--section-pad-x-sm) 96px; min-height: auto; }
    .hero-wordmark { font-size: 32vw; right: -8vw; }
    .hero-eyebrow { margin-bottom: 32px; }
    .ctas { margin-bottom: 32px; }
  }
  @media (min-width: 1536px) {
    .hero { padding: var(--section-pad-y-lg) 32px; }
  }
</style>
```

- [ ] **Step 4: scroll-animations.ts — 히어로 단어별 stagger**

`src/scripts/scroll-animations.ts`의 Hero 진입 로직을 교체:
```ts
// Hero — 단어별 0.08s stagger 페이드업
const words = document.querySelectorAll('#hero .word');
words.forEach((el, i) => {
  (el as HTMLElement).style.opacity = '0';
  (el as HTMLElement).style.transform = 'translateY(8px)';
  (el as HTMLElement).style.transition =
    `opacity 0.55s var(--ease-expo) ${i * 0.08}s, transform 0.55s var(--ease-expo) ${i * 0.08}s`;
});
requestAnimationFrame(() => {
  words.forEach((el) => {
    (el as HTMLElement).style.opacity = '';  // word-muted는 0.3 유지
    (el as HTMLElement).style.transform = 'translateY(0)';
  });
});
```
기존 `glow-orb`, `hero-logo` 관련 로직 제거.

- [ ] **Step 5: 테스트 통과 확인**

Run: `pnpm test --grep 'Hero 재디자인'`
Expected: PASS.

Run: `pnpm test --grep 'Now shipping'`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/scripts/scroll-animations.ts tests/smoke.spec.ts
git commit -m "feat(hero): B 풀블리드 + 아웃라인 워드마크 + Now shipping 링크"
```

---

### Task 7: Philosophy — B 풀폭 편집 + 3분할 원칙

**Files:**
- Modify: `src/components/Philosophy.astro` (전면 재작성)
- Delete: `src/components/PhilosophyCard.astro` (사용 안 함)
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.2

- [ ] **Step 1: 테스트 갱신**

기존 `v2 신규 섹션` > `Philosophy 섹션 3 카드 렌더링`를 다음으로 교체:
```ts
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
```

- [ ] **Step 2: Philosophy.astro 재작성**

```astro
---
const principles = [
  { tag: '01 · ONE TEAM', line1: '설계·개발·운영을', line2: '한 팀이 전담합니다.' },
  { tag: '02 · IN THE FIELD', line1: '쓰이는 장면을', line2: '직접 보고 고칩니다.' },
  { tag: '03 · NO FRICTION LEFT', line1: '작은 마찰까지 오래', line2: '남겨두지 않습니다.' },
];
---
<section id="philosophy" class="phil">
  <div class="phil-inner">
    <div class="phil-eyebrow">02 &nbsp;&nbsp; PHILOSOPHY</div>
    <h2 class="phil-headline">
      <span>쓰이는 소프트웨어가</span>
      <span class="highlight">오래 쓰이는</span>
      <span>소프트웨어입니다.</span>
    </h2>
    <div class="phil-grid">
      {principles.map((p) => (
        <div class="phil-principle" data-phil-principle>
          <div class="phil-principle-tag">{p.tag}</div>
          <div class="phil-principle-line">{p.line1}<br />{p.line2}</div>
        </div>
      ))}
    </div>
  </div>
</section>
<style>
  .phil { padding: var(--section-pad-y) var(--section-pad-x); background: var(--bg-primary); color: var(--text-primary); }
  .phil-inner { max-width: var(--container-wide); margin: 0 auto; }
  .phil-eyebrow {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: var(--tracking-eyebrow); color: var(--text-muted);
    margin-bottom: 32px;
  }
  .phil-headline {
    font-size: clamp(44px, 7vw, 80px); font-weight: 600;
    letter-spacing: var(--tracking-headline); line-height: 1.02;
    max-width: 1100px; margin: 0 0 72px;
  }
  .phil-headline .highlight {
    background: linear-gradient(180deg, transparent 68%, var(--accent-highlight) 68%, var(--accent-highlight) 92%, transparent 92%);
    padding: 0 6px;
  }
  .phil-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding-top: 28px; border-top: 1px solid var(--hairline-strong); }
  .phil-principle-tag {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: var(--tracking-mono-label); color: var(--text-muted);
    margin-bottom: 10px;
  }
  .phil-principle-line { font-size: 14px; line-height: 1.65; color: var(--text-primary); }
  @media (max-width: 768px) {
    .phil { padding: 72px var(--section-pad-x-sm); }
    .phil-headline { font-size: 38px; margin-bottom: 48px; }
    .phil-grid { grid-template-columns: 1fr; gap: 24px; }
  }
</style>
```

- [ ] **Step 3: PhilosophyCard 삭제**

```bash
rm src/components/PhilosophyCard.astro
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm test --grep 'Philosophy 재디자인'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(philosophy): B 풀폭 편집 + 3분할 원칙 + 옐로 하이라이트"
```

---

### Task 8: Process — B 세로 편집 타임라인

**Files:**
- Modify: `src/components/Process.astro` (가로 스크롤 완전 제거)
- Simplify: `src/components/ProcessStep.astro` (새 스펙에 맞춰 재작성)
- Modify: `src/scripts/interactive.ts` (hscroll 로직 제거)
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.4

- [ ] **Step 1: 테스트 갱신**

기존 `Process 섹션 4 단계 렌더링`:
```ts
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
```

- [ ] **Step 2: Process.astro 재작성**

```astro
---
import ProcessStep from './ProcessStep.astro';
import { processSteps } from '../data/process';
---
<section id="process" class="proc" aria-labelledby="process-title">
  <div class="proc-inner">
    <div class="proc-eyebrow">04 &nbsp;&nbsp; PROCESS</div>
    <h2 id="process-title" class="proc-headline">
      어느 단계에도 <span class="muted">지름길은 없습니다.</span>
    </h2>
    <div class="proc-list">
      {processSteps.map((step) => <ProcessStep step={step} />)}
    </div>
  </div>
</section>
<style>
  .proc { padding: var(--section-pad-y) var(--section-pad-x); background: var(--bg-primary); color: var(--text-primary); }
  .proc-inner { max-width: var(--container-wide); margin: 0 auto; }
  .proc-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-eyebrow); color: var(--text-muted); margin-bottom: 32px; }
  .proc-headline { font-size: clamp(40px, 6vw, 72px); font-weight: 600; letter-spacing: var(--tracking-headline); line-height: 1; margin: 0 0 72px; max-width: 1000px; }
  .proc-headline .muted { opacity: 0.35; }
  .proc-list { display: flex; flex-direction: column; }
  @media (max-width: 768px) { .proc { padding: 72px var(--section-pad-x-sm); } .proc-headline { font-size: 38px; margin-bottom: 48px; } }
</style>
```

- [ ] **Step 3: ProcessStep.astro 재작성**

```astro
---
import type { ProcessStep as Step } from '../data/process';
interface Props { step: Step; }
const { step } = Astro.props;
---
<div class="proc-row" data-process-step>
  <div class="proc-num-col">
    <div class="proc-num">{step.index}</div>
    <div class="proc-tag">{step.labelLatin} · {step.labelKo}</div>
  </div>
  <div class="proc-body">
    <h3 class="proc-subtitle">{step.subtitle}</h3>
    <p class="proc-desc">{step.body}</p>
  </div>
  <ul class="proc-principles">
    {step.principles.map((p) => <li>— {p}</li>)}
  </ul>
</div>
<style>
  .proc-row {
    display: grid; grid-template-columns: 200px 1fr 1fr; gap: 40px;
    padding: 44px 0; border-top: 1px solid var(--hairline);
  }
  .proc-row:last-child { border-bottom: 1px solid var(--hairline); }
  .proc-num {
    font-size: 90px; font-weight: 700; letter-spacing: -0.05em;
    line-height: 0.85; font-variant-numeric: tabular-nums;
    color: transparent; -webkit-text-stroke: 1.5px rgba(10,10,10,0.85);
  }
  .proc-tag { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-mono-label); color: var(--text-muted); margin-top: 16px; }
  .proc-subtitle { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 12px; line-height: 1.15; }
  .proc-desc { font-size: 14px; line-height: 1.7; color: var(--text-secondary); margin: 0; }
  .proc-principles { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; line-height: 1.55; color: var(--text-secondary); }
  @media (max-width: 900px) {
    .proc-row { grid-template-columns: 1fr; gap: 16px; padding: 36px 0; }
    .proc-num { font-size: 64px; }
  }
</style>
```

- [ ] **Step 4: interactive.ts에서 hscroll 제거**

`src/scripts/interactive.ts` 열어 `initHscroll` 또는 유사 함수와 호출 제거. `initInteractive`가 hscroll 초기화 호출하면 제거.

- [ ] **Step 5: 테스트 통과 확인**

Run: `pnpm test --grep 'Process 재디자인'`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(process): 가로 스크롤 제거 → 세로 편집 타임라인"
```

---

### Task 9: WhyTakton — A 2×2 헤어라인 그리드

**Files:**
- Modify: `src/components/WhyTakton.astro`, `src/components/WhyCard.astro`
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.5

- [ ] **Step 1: 테스트 갱신**

```ts
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
```

- [ ] **Step 2: WhyTakton.astro 재작성**

```astro
---
import WhyCard from './WhyCard.astro';
import { whyPromises } from '../data/why';
---
<section id="why" class="why" aria-labelledby="why-title">
  <div class="why-inner">
    <div class="why-eyebrow">05 &nbsp;&nbsp; WHY TAKTON</div>
    <h2 id="why-title" class="why-headline">네 가지 약속.</h2>
    <p class="why-subcopy">우리가 반드시 지키는 네 가지.</p>
    <div class="why-grid">
      {whyPromises.map((promise) => <WhyCard promise={promise} />)}
    </div>
    <p class="why-closing">네 가지가 같이 지켜질 때만 "외주가 성공"이라 말할 수 있습니다.</p>
  </div>
</section>
<style>
  .why { padding: var(--section-pad-y) var(--section-pad-x); background: var(--bg-primary); color: var(--text-primary); }
  .why-inner { max-width: var(--container-wide); margin: 0 auto; }
  .why-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-eyebrow); color: var(--text-muted); margin-bottom: 24px; }
  .why-headline { font-size: clamp(40px, 5vw, 56px); font-weight: 600; letter-spacing: -0.04em; line-height: 1; margin: 0 0 12px; }
  .why-subcopy { font-size: 15px; line-height: 1.7; color: var(--text-secondary); margin: 0 0 56px; max-width: 540px; }
  .why-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    border-top: 1px solid var(--hairline-strong);
    border-bottom: 1px solid var(--hairline-strong);
  }
  .why-closing { margin-top: 40px; font-size: 15px; color: var(--text-secondary); max-width: 600px; }
  @media (max-width: 768px) {
    .why { padding: 72px var(--section-pad-x-sm); }
    .why-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 3: WhyCard.astro 재작성**

```astro
---
import type { WhyPromise } from '../data/why';
interface Props { promise: WhyPromise; }
const { promise } = Astro.props;
const oddIndex = ['01', '03'].includes(promise.index);
---
<div class="why-card" data-why-card data-position={oddIndex ? 'left' : 'right'}>
  <div class="why-card-top">
    <div class="why-card-tag">{promise.index} · {promise.category}</div>
    <div class="why-card-arrow" aria-hidden="true">↗</div>
  </div>
  <h3 class="why-card-title">{promise.title}.</h3>
  <p class="why-card-body">{promise.body}</p>
</div>
<style>
  .why-card {
    padding: 48px 40px 48px 0;
    border-bottom: 1px solid var(--hairline);
    transition: transform 0.25s var(--ease-smooth);
  }
  .why-card[data-position='right'] { padding: 48px 0 48px 40px; }
  .why-card[data-position='left'] { border-right: 1px solid var(--hairline); }
  .why-card:nth-last-child(-n+2) { border-bottom: none; }
  .why-card:hover { transform: translateY(-2px); }
  .why-card-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; }
  .why-card-tag { font-family: var(--font-mono); font-size: 14px; color: var(--text-muted); }
  .why-card-arrow { font-size: 16px; color: var(--text-muted); opacity: 0.5; transition: opacity 0.25s; }
  .why-card:hover .why-card-arrow { opacity: 0.9; }
  .why-card-title { font-size: 28px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.2; margin: 0 0 18px; }
  .why-card-body { font-size: 14px; line-height: 1.75; color: var(--text-secondary); margin: 0; }
  @media (max-width: 768px) {
    .why-card, .why-card[data-position='right'] { padding: 36px 0; }
    .why-card[data-position='left'] { border-right: none; }
    .why-card-title { font-size: 24px; }
  }
</style>
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm test --grep 'Why 재디자인'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(why): 2×2 헤어라인 그리드 + 카테고리 eyebrow, 외주 공포 카피 제거"
```

---

### Task 10: FAQ — 편집지 아코디언

**Files:**
- Modify: `src/components/Faq.astro`, `src/components/FaqItem.astro`
- Modify: `src/scripts/faq.ts`
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.7

- [ ] **Step 1: 테스트 업데이트**

기존 `FAQ 아코디언 동작` 테스트는 대부분 유지, assertion 갯수 5로 변경 + 헤드라인 텍스트 갱신:
```ts
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
```

- [ ] **Step 2: Faq.astro 재작성**

```astro
---
import FaqItem from './FaqItem.astro';
import { faqItems } from '../data/faq';
---
<section id="faq" class="faq" aria-labelledby="faq-title">
  <div class="faq-inner">
    <div class="faq-top">
      <div class="faq-left">
        <div class="faq-eyebrow">07 &nbsp;&nbsp; FAQ</div>
        <h2 id="faq-title" class="faq-headline">자주 받는 질문.</h2>
      </div>
      <p class="faq-right">그 외 궁금한 점은 바로 연락주세요.<br />답변은 1 영업일 안에.</p>
    </div>
    <div class="faq-list">
      {faqItems.map((item, i) => <FaqItem item={item} index={String(i + 1).padStart(2, '0')} />)}
    </div>
    <div class="faq-footer">
      <span>이 외의 질문은 따로 받습니다.</span>
      <a href="#contact">문의하기 ↓</a>
    </div>
  </div>
</section>
<style>
  .faq { padding: var(--section-pad-y) var(--section-pad-x); background: var(--bg-primary); color: var(--text-primary); }
  .faq-inner { max-width: var(--container-wide); margin: 0 auto; }
  .faq-top { display: grid; grid-template-columns: 2fr 1fr; gap: 56px; margin-bottom: 56px; }
  .faq-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-eyebrow); color: var(--text-muted); margin-bottom: 20px; }
  .faq-headline { font-size: clamp(36px, 5vw, 48px); font-weight: 600; letter-spacing: -0.035em; line-height: 1.05; margin: 0; }
  .faq-right { padding-top: 16px; font-size: 14px; line-height: 1.7; color: var(--text-secondary); }
  .faq-list { border-top: 1px solid var(--hairline-strong); }
  .faq-footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--hairline-soft); display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: var(--text-secondary); }
  .faq-footer a { color: var(--text-primary); border-bottom: 1px solid var(--text-primary); padding-bottom: 2px; text-decoration: none; font-weight: 500; }
  @media (max-width: 768px) { .faq { padding: 72px var(--section-pad-x-sm); } .faq-top { grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; } }
</style>
```

- [ ] **Step 3: FaqItem.astro 재작성**

```astro
---
import type { FaqItem as Item } from '../data/faq';
interface Props { item: Item; index: string; }
const { item, index } = Astro.props;
const id = `faq-${index}`;
---
<div class="faqi" data-faq-item data-open="false">
  <button
    type="button"
    class="faqi-trigger"
    data-faq-trigger
    aria-expanded="false"
    aria-controls={id}
  >
    <span class="faqi-index">{index}</span>
    <span class="faqi-question">{item.question}</span>
    <span class="faqi-sign" aria-hidden="true">+</span>
    <span class="faqi-underline" aria-hidden="true"></span>
  </button>
  <div id={id} class="faqi-answer" data-faq-answer role="region">
    <div class="faqi-answer-inner">{item.answer}</div>
  </div>
</div>
<style>
  .faqi { border-bottom: 1px solid var(--hairline); }
  .faqi-trigger {
    position: relative;
    width: 100%; background: none; border: none; cursor: pointer;
    padding: 32px 0; display: grid; grid-template-columns: 48px 1fr 40px; gap: 20px;
    align-items: center; text-align: left; color: var(--text-primary);
  }
  .faqi-index { font-family: var(--font-mono); font-size: 13px; color: var(--text-muted); }
  .faqi-question { font-size: clamp(18px, 2vw, 24px); font-weight: 500; letter-spacing: -0.02em; position: relative; }
  .faqi-underline {
    position: absolute; left: 48px; right: 60px;
    bottom: calc(50% - 20px); height: 1px; background: var(--text-primary);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s var(--ease-expo);
    pointer-events: none;
  }
  .faqi-sign { font-size: 20px; font-weight: 300; color: var(--text-muted); text-align: right; transition: transform 0.3s var(--ease-smooth); }
  .faqi[data-open='true'] .faqi-sign { transform: rotate(45deg); }
  .faqi[data-open='true'] .faqi-underline { transform: scaleX(1); }
  .faqi-answer { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.35s var(--ease-detail), opacity 0.35s var(--ease-detail); }
  .faqi-answer-inner {
    padding: 8px 60px 32px 68px;
    font-size: 14.5px; line-height: 1.8; color: var(--text-secondary);
  }
  .faqi[data-open='true'] .faqi-answer { opacity: 1; }
  @media (max-width: 768px) {
    .faqi-trigger { grid-template-columns: 32px 1fr 28px; gap: 12px; padding: 24px 0; }
    .faqi-answer-inner { padding: 8px 0 24px 44px; }
  }
</style>
```

- [ ] **Step 4: faq.ts 스크립트 업데이트**

`src/scripts/faq.ts`:
```ts
export function initFaq(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-faq-item]');
  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-faq-trigger]');
    const answer = item.querySelector<HTMLElement>('[data-faq-answer]');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      // close all others (one-at-a-time)
      items.forEach((other) => {
        if (other === item) return;
        other.dataset.open = 'false';
        other.querySelector<HTMLElement>('[data-faq-answer]')!.style.maxHeight = '0';
        other.querySelector<HTMLButtonElement>('[data-faq-trigger]')!.setAttribute('aria-expanded', 'false');
      });
      if (isOpen) {
        item.dataset.open = 'false';
        answer.style.maxHeight = '0';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.dataset.open = 'true';
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
```

- [ ] **Step 5: 테스트 통과 확인**

Run: `pnpm test --grep 'FAQ 재디자인'`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(faq): 편집지 아코디언 + 언더라인 draw + 스크롤 진입 stagger"
```

---

### Task 11: Contact — 80px 초대 + 4 Direct 채널 + 미니 폼

**Files:**
- Modify: `src/components/Contact.astro`, `src/components/ContactForm.astro`
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.8

- [ ] **Step 1: 테스트 갱신**

```ts
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
```

- [ ] **Step 2: Contact.astro 재작성**

```astro
---
import ContactForm from './ContactForm.astro';
---
<section id="contact" class="contact">
  <div class="contact-inner">
    <div class="contact-top">
      <div class="contact-eyebrow">08 &nbsp;&nbsp; CONTACT</div>
      <h2 class="contact-headline">
        프로젝트 이야기하러<br /><span class="muted">오세요.</span>
      </h2>
      <p class="contact-subcopy">작은 프로젝트도, 큰 프로젝트도 환영합니다. 첫 답변은 평일 기준 24시간 안에.</p>
    </div>
    <div class="contact-grid">
      <div class="contact-direct">
        <div class="direct-group">
          <div class="direct-label">EMAIL</div>
          <a class="direct-email" href="mailto:hello@taktonlabs.com">hello@taktonlabs.com</a>
          <div class="direct-hint">가볍게 안부, 질문 환영</div>
        </div>
        <div class="direct-group">
          <div class="direct-label">PHONE · KAKAO</div>
          <a class="direct-phone" href="tel:010-0000-0000">010-0000-0000</a>
          <div class="direct-hint">카카오톡 채널 @taktonlabs</div>
        </div>
        <div class="direct-group">
          <div class="direct-label">OFFICE</div>
          <div class="direct-office">경상남도 양산시 하북면 신평로 18, 1층</div>
          <div class="direct-hint">양산·부산·경남은 대면 미팅 가능</div>
        </div>
        <div class="direct-group">
          <div class="direct-label">RESPONSE</div>
          <div class="direct-response"><span class="big">24h</span> 평일 기준 첫 답변</div>
        </div>
      </div>
      <div class="contact-form-wrap">
        <div class="form-eyebrow">FORM</div>
        <div class="form-title">정식 문의 — 프로젝트 내용을 자세히.</div>
        <ContactForm />
      </div>
    </div>
  </div>
</section>
<style>
  .contact { padding: 120px var(--section-pad-x) 80px; background: var(--bg-primary); color: var(--text-primary); }
  .contact-inner { max-width: var(--container-wide); margin: 0 auto; }
  .contact-top { display: grid; grid-template-columns: 200px 1fr; gap: 48px; margin-bottom: 80px; }
  .contact-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-eyebrow); color: var(--text-muted); padding-top: 8px; }
  .contact-headline { font-size: clamp(48px, 7vw, 80px); font-weight: 600; letter-spacing: -0.045em; line-height: 0.98; margin: 0 0 24px; max-width: 1000px; }
  .contact-headline .muted { opacity: 0.35; }
  .contact-subcopy { font-size: 16px; line-height: 1.7; color: var(--text-secondary); max-width: 560px; margin: 0; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 64px; padding-top: 48px; border-top: 1px solid var(--hairline-strong); }
  .direct-group { padding: 20px 0; border-bottom: 1px solid var(--hairline-soft); }
  .direct-group:last-child { border-bottom: none; }
  .direct-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: var(--tracking-mono-label); color: var(--text-muted); margin-bottom: 6px; }
  .direct-email { font-size: 26px; font-weight: 500; letter-spacing: -0.015em; border-bottom: 1px solid var(--hairline-strong); padding-bottom: 2px; text-decoration: none; color: var(--text-primary); display: inline-block; }
  .direct-phone { font-size: 20px; font-weight: 500; text-decoration: none; color: var(--text-primary); display: block; }
  .direct-office { font-size: 15px; line-height: 1.6; }
  .direct-response .big { font-size: 32px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; margin-right: 10px; }
  .direct-hint { font-size: 12px; color: var(--text-muted); margin-top: 10px; }
  .contact-form-wrap { background: #fff; border: 1px solid var(--hairline); border-radius: 14px; padding: 36px; }
  .form-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-mono-label); color: var(--text-muted); margin-bottom: 8px; }
  .form-title { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 24px; }
  @media (max-width: 900px) { .contact-top { grid-template-columns: 1fr; } .contact-grid { grid-template-columns: 1fr; gap: 40px; } }
  @media (max-width: 768px) { .contact { padding: 80px var(--section-pad-x-sm) 48px; } .contact-form-wrap { padding: 24px; } }
</style>
```

- [ ] **Step 3: ContactForm.astro 업데이트**

기존 ContactForm.astro를 열어 다음만 변경 (필드 레이아웃을 새 스펙에 맞춤):
- `input[type="text"]`, `input[type="email"]` 스타일을 `border-bottom`만 가진 underline 스타일로
- `textarea`는 `border` 유지
- Project type을 `<fieldset>`의 pill 라디오 버튼으로 (웹·모바일 / 데스크톱 앱 / B2B 맞춤 / 기타)
- 기존 `id="contact-name"`, `id="contact-email"`, `id="contact-message"`, `button[type="submit"]`, `[data-success-state]` 선택자는 유지 (기존 테스트 호환)

```astro
---
---
<form class="contact-form" id="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
  <div class="fg">
    <label for="contact-name" class="fg-label">NAME · 담당자</label>
    <input id="contact-name" name="name" type="text" required class="fg-input" />
  </div>
  <div class="fg-row">
    <div class="fg">
      <label for="contact-company" class="fg-label">COMPANY</label>
      <input id="contact-company" name="company" type="text" class="fg-input" />
    </div>
    <div class="fg">
      <label for="contact-email" class="fg-label">EMAIL *</label>
      <input id="contact-email" name="email" type="email" required class="fg-input" />
    </div>
  </div>
  <fieldset class="fg">
    <legend class="fg-label">PROJECT TYPE</legend>
    <div class="pill-row">
      <label class="pill"><input type="radio" name="project-type" value="web" /><span>웹·모바일</span></label>
      <label class="pill"><input type="radio" name="project-type" value="desktop" /><span>데스크톱 앱</span></label>
      <label class="pill"><input type="radio" name="project-type" value="b2b" /><span>B2B 맞춤</span></label>
      <label class="pill"><input type="radio" name="project-type" value="other" /><span>기타</span></label>
    </div>
  </fieldset>
  <div class="fg">
    <label for="contact-message" class="fg-label">MESSAGE *</label>
    <textarea id="contact-message" name="message" required class="fg-textarea" rows="4" placeholder="어떤 프로젝트인지, 언제 시작하고 싶으신지, 대략적인 예산이 있다면 함께 적어주세요."></textarea>
  </div>
  <div class="fg-foot">
    <span class="fg-note">개인정보는 문의 응대 목적으로만 사용.</span>
    <button type="submit" class="fg-submit">보내기 →</button>
  </div>
  <div class="fg-success" data-success-state hidden>감사합니다. 1 영업일 안에 연락드리겠습니다.</div>
</form>
<style>
  .contact-form { display: flex; flex-direction: column; gap: 22px; }
  .fg-label { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: var(--tracking-mono-label); color: var(--text-muted); margin-bottom: 6px; }
  .fg-input { width: 100%; border: none; border-bottom: 1px solid var(--hairline); padding: 8px 0; font-size: 14px; background: transparent; color: var(--text-primary); font-family: inherit; }
  .fg-input:focus { outline: none; border-bottom-color: var(--text-primary); }
  .fg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .pill-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .pill { position: relative; cursor: pointer; }
  .pill input { position: absolute; opacity: 0; }
  .pill span { display: inline-block; border: 1px solid var(--hairline); padding: 6px 14px; border-radius: 999px; font-size: 12px; transition: all 0.2s; }
  .pill input:checked + span { background: var(--text-primary); color: var(--bg-primary); border-color: var(--text-primary); }
  .fg-textarea { width: 100%; border: 1px solid var(--hairline); border-radius: 8px; padding: 14px; font-size: 14px; line-height: 1.6; resize: vertical; font-family: inherit; background: transparent; color: var(--text-primary); min-height: 100px; }
  .fg-textarea:focus { outline: none; border-color: var(--text-primary); }
  .fg-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; }
  .fg-note { font-size: 11px; color: var(--text-muted); }
  .fg-submit { background: var(--text-primary); color: var(--bg-primary); padding: 14px 24px; border-radius: 999px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; transition: transform 0.2s; }
  .fg-submit:hover { transform: translateY(-2px); }
  .fg-success { padding: 16px; background: rgba(39, 201, 63, 0.08); border-radius: 8px; font-size: 14px; color: #1a7a2e; }
  @media (max-width: 640px) { .fg-row { grid-template-columns: 1fr; } }
</style>
<script>
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const success = document.querySelector<HTMLElement>('[data-success-state]');
  if (form && success) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, { method: 'POST', body: data });
        if (res.ok) {
          form.style.display = 'none';
          success.hidden = false;
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
</script>
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm test --grep 'Contact 재디자인|문의 폼'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(contact): 80px 초대 + 4 Direct 채널 + 밑줄 폼 + pill 선택"
```

---

### Task 12: Footer — 3칼럼 + 법적 한 줄

**Files:**
- Modify: `src/components/Footer.astro`
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.9

- [ ] **Step 1: 테스트 갱신**

```ts
test('Footer 재디자인 — 3칼럼 + 법적 한 줄', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();
  // 3 cols
  await expect(footer.locator('.footer-col')).toHaveCount(3);
  await expect(footer).toContainText('TutorMate');
  await expect(footer).toContainText('핵심 역량');
  await expect(footer).toContainText('hello@taktonlabs.com');
  // 법적 한 줄
  await expect(footer.locator('.footer-legal')).toContainText('325-10-03297');
  await expect(footer.locator('.footer-legal')).toContainText('경남 양산');
  // 대형 워드마크 없음
  await expect(footer.locator('.footer-wordmark')).toHaveCount(0);
  // 카피라이트
  await expect(footer).toContainText('© 2026 Takton Labs');
});
```

- [ ] **Step 2: Footer.astro 재작성**

```astro
---
const products = [
  { label: 'TutorMate', href: '/tutomate', sub: '기본 버전' },
  { label: 'TutorMate Q', href: '/tutomate/q', sub: 'Q 버전', highlightQ: true },
];
const site = [
  { label: '핵심 역량', href: '/#capabilities' },
  { label: '제품', href: '/#products' },
  { label: '문의하기', href: '/#contact' },
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
];
const contacts = [
  { tag: 'GENERAL', label: 'hello@taktonlabs.com', href: 'mailto:hello@taktonlabs.com' },
  { tag: 'SUPPORT', label: 'support@taktonlabs.com', href: 'mailto:support@taktonlabs.com' },
  { tag: 'KAKAO', label: '@taktonlabs', href: '#' },
];
---
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-cols">
      <section class="footer-col">
        <div class="footer-col-tag">PRODUCTS · 제품</div>
        <ul>
          {products.map((p) => (
            <li>
              <a href={p.href}>
                <span class="main">
                  {p.highlightQ ? <>TutorMate <span class="q">Q</span></> : p.label}
                </span>
                {p.sub && <span class="sub">{p.sub}</span>}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section class="footer-col">
        <div class="footer-col-tag">SITE · 바로가기</div>
        <ul>
          {site.map((s) => <li><a href={s.href}>{s.label}</a></li>)}
        </ul>
      </section>
      <section class="footer-col">
        <div class="footer-col-tag">CONTACT · 연락</div>
        <ul>
          {contacts.map((c) => (
            <li>
              <div class="contact-tag">{c.tag}</div>
              <a href={c.href} class="contact-link">{c.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
    <div class="footer-legal">
      텍톤랩스 &nbsp;·&nbsp; 대표 김상철 &nbsp;·&nbsp; 사업자등록번호 325-10-03297 &nbsp;·&nbsp; 경남 양산시 하북면 신평로 18, 1층
    </div>
    <div class="footer-bottom">
      <div>© 2026 Takton Labs. All rights reserved.</div>
      <div class="footer-bottom-right">
        <span>제품을 만듭니다. 끝까지.</span>
        <span class="mono">EST. 2024</span>
      </div>
    </div>
  </div>
</footer>
<style>
  .footer { padding: 72px var(--section-pad-x) 32px; background: var(--bg-primary); color: var(--text-primary); }
  .footer-inner { max-width: var(--container-wide); margin: 0 auto; }
  .footer-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; padding-bottom: 40px; border-bottom: 1px solid var(--hairline); }
  .footer-col-tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: var(--tracking-mono-label); color: var(--text-muted); margin-bottom: 20px; }
  .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
  .footer-col a { color: var(--text-primary); text-decoration: none; opacity: 0.78; transition: opacity 0.2s; }
  .footer-col a:hover { opacity: 1; }
  .footer-col .main { font-size: 15px; font-weight: 500; letter-spacing: -0.01em; display: block; }
  .footer-col .main .q { color: var(--accent-q-blue); }
  .footer-col .sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; display: block; }
  .contact-tag { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-bottom: 2px; }
  .contact-link { font-size: 13px; border-bottom: 1px solid var(--hairline); padding-bottom: 1px; display: inline-block; }
  .footer-legal {
    padding: 20px 0 16px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.02em;
    color: var(--text-secondary);
    opacity: 0.6;
    line-height: 1.8;
  }
  .footer-bottom {
    padding-top: 16px;
    border-top: 1px solid var(--hairline-soft);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: var(--text-muted);
  }
  .footer-bottom-right { display: flex; gap: 16px; }
  .footer-bottom-right .mono { font-family: var(--font-mono); }
  @media (max-width: 768px) {
    .footer { padding: 56px var(--section-pad-x-sm) 24px; }
    .footer-cols { grid-template-columns: 1fr; gap: 32px; }
    .footer-bottom { flex-direction: column; gap: 8px; align-items: flex-start; }
  }
</style>
```

- [ ] **Step 3: 테스트 통과 확인**

Run: `pnpm test --grep 'Footer 재디자인'`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(footer): 3칼럼 + 법적 한 줄 — 대형 워드마크 제거"
```

---

## Phase 2 — Complex Animations

### Task 13: Capabilities — 정적 구조 (BIG + DOCK DOM) 먼저

**Files:**
- Modify: `src/components/Capabilities.astro`
- Modify: `src/components/CapabilityCard.astro`
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.3. 여기선 애니메이션 없이 **DOM 구조와 CSS만** 먼저 구축 (모바일 대응). Task 14에서 GSAP 타임라인 추가.

- [ ] **Step 1: 테스트 (정적 구조)**

```ts
test('Capabilities 정적 구조 — DOM 준비', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#capabilities');
  await expect(section).toBeVisible();
  await expect(section.locator('[data-cap-eyebrow]')).toContainText('CAPABILITIES');
  await expect(section.locator('[data-cap-headline]')).toContainText('세 가지로 만듭니다');
  await expect(section.locator('[data-cap-progress] > *')).toHaveCount(3);
  await expect(section.locator('[data-cap-card]')).toHaveCount(3);
  await expect(section.locator('[data-cap-dock]')).toHaveCount(3);
  // BIG 카드 내부 구조
  const firstCard = section.locator('[data-cap-card]').first();
  await expect(firstCard).toContainText('01');
  await expect(firstCard).toContainText('웹 · 모바일 제품');
  await expect(firstCard.locator('[data-proof="browser"]')).toBeVisible();
});
```

- [ ] **Step 2: Capabilities.astro 재작성**

```astro
---
import CapabilityCard from './CapabilityCard.astro';
import { capabilities } from '../data/capabilities';
---
<section id="capabilities" class="cap">
  <div class="cap-pin">
    <div class="cap-head">
      <div class="cap-eyebrow" data-cap-eyebrow>
        CAPABILITIES &nbsp;/&nbsp; <span data-cap-active-title>01 · 웹 · 모바일 제품</span>
      </div>
      <div class="cap-progress" data-cap-progress>
        <div class="cap-progress-seg" data-seg="0"></div>
        <div class="cap-progress-seg" data-seg="1"></div>
        <div class="cap-progress-seg" data-seg="2"></div>
      </div>
    </div>

    <h2 class="cap-headline" data-cap-headline>
      세 가지로 만듭니다.
    </h2>

    <!-- dock bar: 3 docked slots (초기엔 hidden, 카드가 이동하며 채움) -->
    <div class="cap-dock-bar">
      {capabilities.map((c, i) => (
        <div class="cap-dock" data-cap-dock data-index={i}>
          <span class="dock-num">{c.index}</span>
          <span class="dock-title">{c.title}</span>
          <span class="dock-check">✓</span>
        </div>
      ))}
    </div>

    <!-- BIG 카드 stage: 3 카드가 absolute 겹쳐있음 -->
    <div class="cap-stage" data-cap-stage>
      {capabilities.map((c, i) => (
        <CapabilityCard capability={c} index={i} />
      ))}
    </div>
  </div>
</section>
<style>
  .cap { position: relative; background: var(--bg-primary); color: var(--text-primary); }
  .cap-pin { padding: 40px var(--section-pad-x); min-height: 100vh; display: flex; flex-direction: column; }
  .cap-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .cap-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-eyebrow); color: var(--text-muted); }
  .cap-eyebrow [data-cap-active-title] { color: var(--text-primary); }
  .cap-progress { display: flex; gap: 3px; width: 120px; }
  .cap-progress-seg { flex: 1; height: 2px; background: var(--hairline); position: relative; overflow: hidden; }
  .cap-progress-seg::after { content: ''; position: absolute; inset: 0; background: var(--text-primary); transform: scaleX(0); transform-origin: left; transition: transform 0.3s var(--ease-expo); }
  .cap-progress-seg[data-filled='true']::after { transform: scaleX(1); }
  .cap-headline { font-size: clamp(40px, 6vw, 64px); font-weight: 600; letter-spacing: -0.04em; margin: 0 0 48px; line-height: 1; }
  .cap-dock-bar { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 48px; min-height: 54px; }
  .cap-dock {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    background: #fff; border: 1px solid var(--hairline); border-radius: 10px;
    opacity: 0;                  /* 초기 hidden, 타임라인에서 띄움 */
    transition: opacity 0.3s var(--ease-smooth);
  }
  .dock-num { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
  .dock-title { font-size: 13px; font-weight: 600; flex: 1; }
  .dock-check { font-size: 11px; color: var(--text-muted); opacity: 0.5; }
  .cap-stage { position: relative; flex: 1; min-height: 340px; }

  @media (max-width: 768px) {
    .cap-pin { padding: 48px var(--section-pad-x-sm); min-height: auto; }
    .cap-headline { font-size: 32px; margin-bottom: 32px; }
    .cap-dock-bar { display: none; }
    .cap-stage { min-height: auto; display: flex; flex-direction: column; gap: 16px; }
  }
</style>
```

- [ ] **Step 3: CapabilityCard.astro 재작성 (BIG 상태 전용)**

```astro
---
import type { Capability } from '../data/capabilities';
interface Props { capability: Capability; index: number; }
const { capability: c, index } = Astro.props;
---
<article class="cc" data-cap-card data-index={index}>
  <div class="cc-left">
    <div class="cc-num">{c.index}</div>
    <h3 class="cc-title">{c.title}</h3>
    <p class="cc-desc">{c.description}</p>
    <div class="cc-principles">
      {c.principles.map((p) => <span>— {p}</span>)}
    </div>
  </div>
  <div class="cc-right">
    {c.proofType === 'browser' && (
      <div class="proof proof-browser" data-proof="browser">
        <div class="browser-bar">
          <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
          <span class="browser-url">example.com</span>
        </div>
        <div class="browser-body">
          <div class="browser-main">
            <div class="line-heading"></div>
            <div class="line"></div>
            <div class="line short"></div>
            <div class="browser-btn"></div>
          </div>
          <div class="browser-side"></div>
        </div>
      </div>
    )}
    {c.proofType === 'native-window' && (
      <div class="proof proof-native" data-proof="native-window">
        <div class="native-bar">
          <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
        </div>
        <div class="native-body">
          <div class="native-sidebar">
            <span class="item"></span><span class="item"></span>
            <span class="item active"></span>
            <span class="item"></span>
          </div>
          <div class="native-main">
            <div class="micro-date">2026 · 4월</div>
            <div class="micro-amount">₩ 18,420,000</div>
            <div class="micro-delta">전월 대비 ▲ 12.4%</div>
            <div class="bar-chart">
              <div style="height:40%"></div>
              <div style="height:60%"></div>
              <div style="height:50%"></div>
              <div style="height:75%"></div>
              <div style="height:68%"></div>
              <div style="height:92%; background:#0a0a0a"></div>
            </div>
          </div>
        </div>
      </div>
    )}
    {c.proofType === 'dashboard-tiles' && (
      <div class="proof proof-tiles" data-proof="dashboard-tiles">
        <div class="tile"><div class="t-label">월 매출</div><div class="t-value">+12.4%</div></div>
        <div class="tile"><div class="t-label">미수금</div><div class="t-value">₩ 2.1M</div></div>
        <div class="tile dark"><div class="t-label">결제</div><div class="t-value">142</div></div>
        <div class="tile"><div class="t-label">활성</div><div class="t-value">89</div></div>
      </div>
    )}
  </div>
</article>
<style>
  .cc {
    position: absolute; inset: 0;
    display: grid; grid-template-columns: 1fr 300px; gap: 48px;
    align-items: center;
    padding: 28px 32px;
    background: #fff; border: 1px solid rgba(10,10,10,0.08); border-radius: 14px;
    box-shadow: 0 30px 60px -30px rgba(0,0,0,0.18);
    will-change: transform, width, height, top, left;
  }
  .cc[data-index='1'], .cc[data-index='2'] { opacity: 0; }   /* 초기 01만 보임 */
  .cc-left { min-width: 0; }
  .cc-num {
    font-size: 110px; font-weight: 700; letter-spacing: -0.05em;
    line-height: 0.85; font-variant-numeric: tabular-nums;
    color: transparent; -webkit-text-stroke: 1.6px rgba(10,10,10,0.88);
    background: linear-gradient(180deg, #0a0a0a 0%, #0a0a0a 38%, transparent 38%);
    -webkit-background-clip: text; background-clip: text;
    margin-bottom: 14px;
  }
  .cc-title { font-size: 30px; font-weight: 600; letter-spacing: -0.025em; margin: 0 0 10px; }
  .cc-desc { font-size: 13px; line-height: 1.7; color: var(--text-secondary); margin: 0 0 14px; max-width: 460px; }
  .cc-principles { font-size: 12px; color: var(--text-secondary); display: flex; gap: 10px; flex-wrap: wrap; }
  .cc-principles span { white-space: nowrap; }

  /* ===== Proof: Browser ===== */
  .proof-browser { background: #fff; border: 1px solid var(--hairline); border-radius: 10px; padding: 8px; }
  .browser-bar { display: flex; gap: 4px; align-items: center; margin-bottom: 6px; }
  .browser-bar .dot { width: 7px; height: 7px; border-radius: 50%; }
  .dot.r { background: #ff5f56; } .dot.y { background: #ffbd2e; } .dot.g { background: #27c93f; }
  .browser-url { flex: 1; margin-left: 8px; height: 14px; background: #f4f4ef; border-radius: 4px; padding: 0 8px; display: flex; align-items: center; font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); }
  .browser-body { background: #f4f4ef; border-radius: 6px; height: 150px; display: grid; grid-template-columns: 1.3fr 1fr; gap: 8px; padding: 12px; }
  .browser-main { display: flex; flex-direction: column; gap: 6px; justify-content: center; }
  .line-heading { height: 12px; width: 65%; background: #0a0a0a; opacity: 0.88; border-radius: 2px; }
  .line { height: 5px; background: rgba(10,10,10,0.3); border-radius: 1px; width: 90%; }
  .line.short { width: 70%; }
  .browser-btn { margin-top: 6px; width: 60px; height: 20px; background: #0a0a0a; border-radius: 12px; }
  .browser-side { background: #fff; border-radius: 4px; border: 1px solid var(--hairline-soft); }

  /* ===== Proof: Native ===== */
  .proof-native { background: linear-gradient(180deg, #fff, #f8f8f5); border: 1px solid var(--hairline); border-radius: 12px; padding: 10px; box-shadow: 0 20px 40px -20px rgba(0,0,0,0.18); }
  .native-bar { display: flex; gap: 5px; margin-bottom: 8px; }
  .native-bar .dot { width: 9px; height: 9px; border-radius: 50%; }
  .native-body { background: #f4f4ef; border-radius: 8px; padding: 10px; min-height: 180px; display: grid; grid-template-columns: 60px 1fr; gap: 6px; }
  .native-sidebar { background: #fff; border-radius: 4px; padding: 6px; display: flex; flex-direction: column; gap: 5px; }
  .native-sidebar .item { height: 4px; background: rgba(10,10,10,0.2); border-radius: 1px; }
  .native-sidebar .item.active { background: #0a0a0a; }
  .native-main { background: #fff; border-radius: 4px; padding: 10px; }
  .micro-date { font-family: var(--font-mono); font-size: 8px; color: var(--text-muted); }
  .micro-amount { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; margin-top: 2px; }
  .micro-delta { font-size: 9px; color: var(--text-muted); margin-top: 1px; }
  .bar-chart { margin-top: 10px; display: flex; gap: 2px; align-items: flex-end; height: 32px; }
  .bar-chart > div { flex: 1; background: #e5e3dc; border-radius: 1px; }

  /* ===== Proof: Tiles ===== */
  .proof-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .tile { background: #fff; border: 1px solid var(--hairline); border-radius: 6px; padding: 10px; min-height: 50px; }
  .tile.dark { background: #0a0a0a; color: var(--bg-primary); }
  .t-label { font-size: 8px; color: var(--text-muted); }
  .tile.dark .t-label { color: rgba(255,255,255,0.55); }
  .t-value { font-size: 14px; font-weight: 600; margin-top: 3px; font-variant-numeric: tabular-nums; }

  @media (max-width: 768px) {
    .cc { position: relative; inset: auto; opacity: 1 !important; grid-template-columns: 1fr; gap: 20px; }
    .cc[data-index] { opacity: 1 !important; }
    .cc-right .proof { max-width: 480px; }
  }
</style>
```

- [ ] **Step 4: 정적 렌더 확인**

Run: `pnpm dev` → 브라우저 http://localhost:4321 → Capabilities 섹션. 모바일 프리뷰(DevTools)에서 3카드 세로 스택 렌더링되는지 확인.
Run: `pnpm test --grep 'Capabilities 정적'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(capabilities): 정적 DOM 구조 (BIG stage + dock bar + 3 proof 타입)"
```

---

### Task 14: Capabilities — pinned morph 타임라인

**Files:**
- Create: `src/scripts/sections/capabilities-morph.ts`
- Modify: `src/components/Capabilities.astro` (script 추가)

**Design ref:** spec §4.3, mechanic 구간 0.22/0.38/0.56/0.74/0.88/1.00

- [ ] **Step 1: capabilities-morph.ts 작성**

```ts
// src/scripts/sections/capabilities-morph.ts
import { EASE, prefersReducedMotion, isDesktopViewport, loadGsap } from '../../lib/motion';

interface DockTarget { top: number; left: number; width: number; height: number; }

export async function initCapabilitiesMorph(): Promise<void> {
  const section = document.querySelector<HTMLElement>('#capabilities');
  if (!section) return;

  if (prefersReducedMotion() || !isDesktopViewport()) {
    // 최종 상태로 즉시 노출 — 3 카드 모두 보이고 docked
    section.querySelectorAll<HTMLElement>('[data-cap-card]').forEach((el) => {
      el.style.opacity = '1';
      el.style.position = 'relative';
    });
    section.querySelectorAll<HTMLElement>('[data-cap-dock]').forEach((el) => el.style.opacity = '1');
    return;
  }

  const { gsap } = await loadGsap();

  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-cap-card]'));
  const docks = Array.from(section.querySelectorAll<HTMLElement>('[data-cap-dock]'));
  const progressSegs = Array.from(section.querySelectorAll<HTMLElement>('.cap-progress-seg'));
  const activeTitleEl = section.querySelector<HTMLElement>('[data-cap-active-title]');
  const titles = ['01 · 웹 · 모바일 제품', '02 · 데스크톱 앱', '03 · B2B 맞춤 개발'];

  // pin 섹션 높이 설정
  section.style.height = '300vh';
  const pinEl = section.querySelector<HTMLElement>('.cap-pin')!;
  pinEl.style.position = 'sticky';
  pinEl.style.top = '0';
  pinEl.style.height = '100vh';

  // dock 슬롯의 타깃 좌표 측정 (stage 기준 상대좌표)
  const stage = section.querySelector<HTMLElement>('[data-cap-stage]')!;
  function getDockTarget(idx: number): DockTarget {
    const dock = docks[idx];
    const stageRect = stage.getBoundingClientRect();
    const dockRect = dock.getBoundingClientRect();
    return {
      top: dockRect.top - stageRect.top,
      left: dockRect.left - stageRect.left,
      width: dockRect.width,
      height: dockRect.height,
    };
  }

  // 타임라인
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // 각 카드 life-cycle
  // 01: BIG 0~0.22 → shrink 0.22~0.38 → stay docked
  // 02: enter 0.25~0.40 → BIG 0.40~0.56 → shrink 0.56~0.74
  // 03: enter 0.60~0.76 → BIG 0.76~0.88 → shrink 0.88~1.00

  function addCardLifecycle(idx: number, enterFrom: number, bigEnd: number, shrinkEnd: number) {
    const card = cards[idx];
    // 진입: 02, 03만 enterFrom 구간에서 opacity 0 → 1, y 20 → 0
    if (idx > 0) {
      gsap.set(card, { opacity: 0, y: 20 });
      tl.to(card, { opacity: 1, y: 0, ease: EASE.expo, duration: 1 }, enterFrom);
    }
    // shrink: bigEnd ~ shrinkEnd 구간에서 dock 좌표로 morph
    tl.call(
      () => {
        const target = getDockTarget(idx);
        gsap.to(card, {
          top: target.top,
          left: target.left,
          width: target.width,
          height: target.height,
          ease: EASE.expo,
          overwrite: true,
          scrollTrigger: undefined,
        });
      },
      undefined,
      bigEnd,
    );
    // 내부 요소 축소 — font-size 보간
    tl.to(card.querySelector('.cc-num'), { fontSize: 16, duration: shrinkEnd - bigEnd, ease: EASE.expo }, bigEnd);
    tl.to(card.querySelector('.cc-title'), { fontSize: 13, duration: shrinkEnd - bigEnd, ease: EASE.expo }, bigEnd);
    // 설명/프루프 먼저 접힘
    tl.to(card.querySelectorAll('.cc-desc, .cc-principles, .cc-right'), { opacity: 0, maxHeight: 0, duration: (shrinkEnd - bigEnd) * 0.6, ease: EASE.detail }, bigEnd - 0.02);
    // dock slot 표시 (완료 직후)
    tl.to(docks[idx], { opacity: 1, duration: 0.15, ease: EASE.smooth }, shrinkEnd);
  }

  addCardLifecycle(0, 0, 0.22, 0.38);
  addCardLifecycle(1, 0.25, 0.56, 0.74);
  addCardLifecycle(2, 0.60, 0.88, 1.00);

  // eyebrow 활성 타이틀 교체
  const titleSwap = [
    { at: 0.38, text: titles[1] },
    { at: 0.74, text: titles[2] },
  ];
  titleSwap.forEach((t) => {
    tl.call(() => { if (activeTitleEl) activeTitleEl.textContent = t.text; }, undefined, t.at);
  });

  // progress segments
  const segMilestones = [0.22, 0.56, 0.88];
  segMilestones.forEach((at, i) => {
    tl.call(() => { progressSegs[i].dataset.filled = 'true'; }, undefined, at);
  });
}
```

> **구현 노트:** 이 initial 버전은 "크로스페이드가 아닌 실제 box morph"를 목표로 한다. 실제로 GSAP Flip 플러그인을 쓰는 것이 더 정확하지만, dependency 최소화를 위해 위처럼 dock 좌표를 직접 측정하는 방식으로 먼저 구현. 추후 조정이 필요한 항목:
> - 텍스트(숫자·타이틀)의 좌상단 anchor 고정 — 현재는 컨테이너 top/left로만 이동. 별도 transform-origin 처리로 개선 가능.
> - resize 대응: `invalidateOnRefresh: true`로 ScrollTrigger가 재측정하되, `getDockTarget` 호출이 scrub 중이 아닌 초기에 이뤄지므로 resize 후 location 재측정 hook 추가 필요.

- [ ] **Step 2: Capabilities.astro script 연결**

```astro
<script>
  import { initCapabilitiesMorph } from '../scripts/sections/capabilities-morph';
  initCapabilitiesMorph();
</script>
```

(Capabilities.astro 파일 끝에 `<style>` 다음에 추가)

- [ ] **Step 3: 테스트**

```ts
test('Capabilities 모바일은 pin 해제 + 3카드 세로 스택', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await context.newPage();
  await page.goto('/');
  const cards = page.locator('[data-cap-card]');
  await expect(cards).toHaveCount(3);
  // 모든 카드가 동시에 보여야 함 (세로 스택)
  for (let i = 0; i < 3; i++) {
    await expect(cards.nth(i)).toBeVisible();
  }
  await context.close();
});

test('Capabilities reduced-motion — 3카드 즉시 노출', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const cards = page.locator('[data-cap-card]');
  for (let i = 0; i < 3; i++) {
    const op = await cards.nth(i).evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(op)).toBe(1);
  }
  await context.close();
});
```

Run: `pnpm test --grep 'Capabilities'`
Expected: PASS.

- [ ] **Step 4: 데스크톱 수동 QA**

`pnpm dev` → http://localhost:4321 → Capabilities 섹션 도달 → 천천히 스크롤하며 01 BIG → dock 이동 → 02 등장 → … → 03 등장 → 모두 docked 확인.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(capabilities): pinned morph 타임라인 (GSAP ScrollTrigger scrub)"
```

---

### Task 15: Products — 정적 구조 (딥 블랙 섹션 + 3 화면 컨텐츠)

**Files:**
- Modify: `src/components/Products.astro`
- Modify: `src/components/ProductCard.astro` → 삭제 (사용 안 함) 또는 Mac 창 inline
- Modify: `tests/smoke.spec.ts`

**Design ref:** spec §4.6

- [ ] **Step 1: 테스트 (정적 구조)**

```ts
test('Products 정적 구조 — 딥 블랙 + 3 화면', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#products');
  await expect(section).toBeVisible();
  await expect(section.locator('.prod-headline')).toContainText('매일 쓰고');
  await expect(section.locator('[data-prod-screen]')).toHaveCount(3);
  await expect(section.locator('[data-prod-caption]')).toHaveCount(3);
  // 다크 배경
  const bg = await section.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  expect(bg).toMatch(/rgb\(10,\s*10,\s*10\)/);
  // CTA 스트립
  await expect(section.locator('.prod-cta-download')).toContainText('다운로드');
});
```

- [ ] **Step 2: Products.astro 재작성**

```astro
---
const screens = [
  { index: '01', tag: 'DASHBOARD', caption: '한눈에 보이는 하루.', body: '오늘 수업, 결제 건수, 미납 안내, 학생 알림. 복잡한 학원 운영이 한 화면에.', principles: ['실시간 오늘 일정', '수업 1-클릭 출석', '미납 자동 리마인드'] },
  { index: '02', tag: 'STUDENTS', caption: '수강생, 놓치지 않게.', body: '신규 등록부터 재등록, 휴원, 수강권 종료 예정까지. 한 명도 놓치지 않는 시스템.', principles: ['수강권 잔여 자동 표시', '종료 예정 자동 알림', '휴원/재등록 이력 관리'] },
  { index: '03', tag: 'REVENUE', caption: '숫자가 먼저 말합니다.', body: '월간 매출, 미수금, 결제 수단 분포까지 한눈에. 엑셀 없이도 회계가 보입니다.', principles: ['월별 매출 자동 집계', '결제 수단 분석', '정산 리포트'] },
];
---
<section id="products" class="prod">
  <div class="prod-pin">
    <div class="prod-head">
      <div class="prod-eyebrow">06 &nbsp;/&nbsp; OUR PRODUCT &nbsp;·&nbsp; <span>TutorMate</span></div>
      <div class="prod-progress" data-prod-progress>
        <div class="seg"></div><div class="seg"></div><div class="seg"></div>
      </div>
    </div>

    <h2 class="prod-headline">
      이론이 아닙니다.<br /><span class="muted">매일 쓰고, 매주 고칩니다.</span>
    </h2>

    <div class="prod-stage">
      <div class="prod-caption-col">
        {screens.map((s, i) => (
          <div class="prod-caption" data-prod-caption data-index={i} style={i === 0 ? '' : 'opacity:0'}>
            <div class="caption-tag">{s.index} · {s.tag}</div>
            <div class="caption-title">{s.caption}</div>
            <div class="caption-body">{s.body}</div>
            <div class="caption-princ">— {s.principles.join('  — ')}</div>
          </div>
        ))}
      </div>

      <div class="prod-window">
        <div class="window-bar">
          <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
          <span class="window-title" data-prod-window-title>TutorMate — 대시보드</span>
        </div>
        <div class="window-body">
          {screens.map((s, i) => (
            <div class="prod-screen" data-prod-screen data-index={i} style={i === 0 ? '' : 'opacity:0;position:absolute;inset:10px'}>
              {i === 0 && (
                <div class="screen-dashboard">
                  <aside class="screen-side">
                    <span class="item active"></span>
                    <span class="item"></span><span class="item"></span>
                    <span class="item"></span><span class="item"></span>
                  </aside>
                  <div class="screen-main">
                    <div class="stat-row">
                      <div class="stat"><div class="sl">오늘 수업</div><div class="sv">14</div></div>
                      <div class="stat"><div class="sl">출석률</div><div class="sv">94%</div></div>
                      <div class="stat dark"><div class="sl">미납 알림</div><div class="sv">3건</div></div>
                    </div>
                    <div class="today-list">
                      <div class="today-date">2026 · 4 · 17 &nbsp; 오늘 일정</div>
                      <div class="today-row"><span>09:00</span><span class="bar"></span></div>
                      <div class="today-row"><span>10:30</span><span class="bar active"></span></div>
                      <div class="today-row"><span>14:00</span><span class="bar"></span></div>
                      <div class="today-row"><span>16:00</span><span class="bar"></span></div>
                    </div>
                  </div>
                </div>
              )}
              {i === 1 && (
                <div class="screen-students">
                  <aside class="screen-side">
                    <span class="item"></span>
                    <span class="item active"></span>
                    <span class="item"></span><span class="item"></span>
                  </aside>
                  <div class="screen-main">
                    <div class="student-header"><span>이름</span><span>수강권</span><span>잔여</span><span>상태</span></div>
                    <div class="student-row"><span>김○○</span><span>주 3회 · 월</span><span>8회</span><span class="pill blue">진행</span></div>
                    <div class="student-row"><span>이○○</span><span>주 2회 · 분기</span><span class="red">2회</span><span class="pill red">종료 예정</span></div>
                    <div class="student-row"><span>박○○</span><span>주 1회 · 월</span><span>4회</span><span class="pill blue">진행</span></div>
                    <div class="student-row muted"><span>최○○</span><span>휴원</span><span>—</span><span class="pill gray">휴원</span></div>
                  </div>
                </div>
              )}
              {i === 2 && (
                <div class="screen-revenue">
                  <div class="rev-header">2026 · 4월 / ₩ 18,420,000 / ▲ 12.4%</div>
                  <div class="rev-chart">
                    <div style="height:40%"></div>
                    <div style="height:60%"></div>
                    <div style="height:55%"></div>
                    <div style="height:72%"></div>
                    <div style="height:68%"></div>
                    <div style="height:92%" class="accent"></div>
                  </div>
                  <div class="rev-foot">최근 결제 142건</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ol class="prod-indicators">
        {screens.map((s, i) => (
          <li data-prod-indicator data-index={i} data-active={i === 0}>
            <span class="ind-line"></span><span class="ind-num">{s.index}</span>
          </li>
        ))}
      </ol>
    </div>
  </div>

  <!-- CTA 스트립: pin 바깥 -->
  <div class="prod-cta">
    <div class="cta-left">
      <div class="cta-eyebrow">SHIPPING NOW</div>
      <div class="cta-headline">지금 쓸 수 있습니다.</div>
    </div>
    <div class="cta-right">
      <a href="/tutomate" class="prod-cta-download">다운로드 →</a>
      <a href="/tutomate" class="prod-cta-learn">자세히 알아보기</a>
    </div>
  </div>
  <div class="prod-tags">
    <span>Windows · macOS</span>
    <span>자동 업데이트</span>
    <span>오프라인 동작</span>
    <span>무료 체험</span>
  </div>
</section>
<style>
  .prod {
    position: relative;
    background: var(--bg-dark);
    color: var(--dark-text-primary);
    padding: 0 var(--section-pad-x) 64px;
  }
  .prod-pin { padding-top: 72px; padding-bottom: 72px; min-height: 100vh; display: flex; flex-direction: column; position: relative; }
  .prod-pin::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.04), transparent 60%); pointer-events: none; }
  .prod-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; position: relative; }
  .prod-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-eyebrow); color: rgba(255,255,255,0.55); }
  .prod-eyebrow span { color: var(--dark-text-primary); }
  .prod-progress { display: flex; gap: 3px; width: 100px; }
  .prod-progress .seg { flex: 1; height: 2px; background: rgba(255,255,255,0.15); position: relative; overflow: hidden; }
  .prod-progress .seg::after { content: ''; position: absolute; inset: 0; background: var(--dark-text-primary); transform: scaleX(0); transform-origin: left; transition: transform 0.3s var(--ease-expo); }
  .prod-progress .seg[data-filled='true']::after { transform: scaleX(1); }
  .prod-headline { font-size: clamp(44px, 5.5vw, 68px); font-weight: 600; letter-spacing: -0.045em; line-height: 1; margin: 0 0 56px; max-width: 900px; position: relative; }
  .prod-headline .muted { opacity: 0.4; }
  .prod-stage { display: grid; grid-template-columns: 340px 1fr 80px; gap: 48px; align-items: center; flex: 1; position: relative; }

  .prod-caption-col { position: relative; min-height: 200px; }
  .prod-caption { position: absolute; inset: 0; transition: opacity 0.4s var(--ease-smooth); }
  .caption-tag { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-mono-label); color: rgba(255,255,255,0.55); margin-bottom: 18px; }
  .caption-title { font-size: 36px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 18px; }
  .caption-body { font-size: 14.5px; line-height: 1.75; color: var(--dark-text-secondary); max-width: 320px; margin-bottom: 18px; }
  .caption-princ { font-size: 12px; line-height: 1.9; color: rgba(255,255,255,0.7); }

  .prod-window {
    background: linear-gradient(180deg, #fafaf7, #f0ede5);
    border-radius: 14px; padding: 12px;
    box-shadow: 0 60px 120px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08) inset;
    color: var(--text-primary);
  }
  .window-bar { display: flex; gap: 6px; margin-bottom: 10px; align-items: center; }
  .window-bar .dot { width: 11px; height: 11px; border-radius: 50%; }
  .window-title { margin-left: auto; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
  .window-body { position: relative; background: #f4f4ef; border-radius: 10px; padding: 10px; min-height: 320px; }
  .prod-screen { width: 100%; }

  /* dashboard */
  .screen-dashboard { display: grid; grid-template-columns: 120px 1fr; gap: 10px; }
  .screen-side { background: #fff; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .screen-side .item { height: 20px; background: rgba(10,10,10,0.1); border-radius: 4px; }
  .screen-side .item.active { background: #0a0a0a; }
  .screen-main { display: flex; flex-direction: column; gap: 8px; }
  .stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .stat { background: #fff; border-radius: 6px; padding: 12px; }
  .stat.dark { background: #0a0a0a; color: var(--bg-primary); }
  .sl { font-size: 9px; color: var(--text-muted); }
  .stat.dark .sl { color: rgba(255,255,255,0.55); }
  .sv { font-size: 20px; font-weight: 600; margin-top: 3px; font-variant-numeric: tabular-nums; }
  .today-list { background: #fff; border-radius: 6px; padding: 12px; flex: 1; }
  .today-date { font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); margin-bottom: 8px; }
  .today-row { display: flex; gap: 8px; align-items: center; font-size: 10px; margin-bottom: 6px; }
  .today-row > span:first-child { font-family: var(--font-mono); color: var(--text-muted); }
  .today-row .bar { flex: 1; height: 8px; background: #e5e3dc; border-radius: 2px; }
  .today-row .bar.active { background: #0a0a0a; }

  /* students */
  .screen-students { display: grid; grid-template-columns: 120px 1fr; gap: 10px; }
  .student-header, .student-row { display: grid; grid-template-columns: 2fr 1.3fr 1fr 60px; gap: 8px; padding: 8px 10px; font-size: 10px; }
  .student-header { font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); border-bottom: 1px solid var(--hairline); }
  .student-row { background: #fff; border-bottom: 1px solid #f4f4ef; align-items: center; }
  .student-row.muted { opacity: 0.5; }
  .student-row .red { color: #c44; font-weight: 600; }
  .pill { padding: 2px 6px; border-radius: 10px; font-size: 8px; text-align: center; }
  .pill.blue { background: #e8f0ff; color: #0055cc; }
  .pill.red { background: #fff2e8; color: #c44; }
  .pill.gray { background: #f0f0ed; }

  /* revenue */
  .screen-revenue { padding: 16px; }
  .rev-header { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-bottom: 16px; }
  .rev-chart { display: flex; gap: 4px; align-items: flex-end; height: 120px; }
  .rev-chart > div { flex: 1; background: #e5e3dc; border-radius: 2px; }
  .rev-chart > div.accent { background: #0a0a0a; }
  .rev-foot { font-size: 10px; color: var(--text-muted); margin-top: 10px; }

  .prod-indicators { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 24px; }
  .prod-indicators li { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; opacity: 0.4; transition: opacity 0.3s; }
  .prod-indicators li[data-active='true'] { opacity: 1; }
  .ind-line { width: 2px; height: 14px; background: rgba(255,255,255,0.3); }
  .prod-indicators li[data-active='true'] .ind-line { background: var(--dark-text-primary); }

  /* CTA 스트립 */
  .prod-cta { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: center; margin-top: 40px; padding-top: 40px; }
  .cta-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: var(--tracking-mono-label); color: rgba(255,255,255,0.55); margin-bottom: 14px; }
  .cta-headline { font-size: clamp(32px, 4vw, 40px); font-weight: 600; letter-spacing: -0.035em; }
  .cta-right { display: flex; gap: 10px; }
  .prod-cta-download { background: var(--dark-text-primary); color: var(--bg-dark); padding: 14px 22px; border-radius: 999px; text-decoration: none; font-weight: 500; font-size: 14px; }
  .prod-cta-learn { color: var(--dark-text-primary); border: 1px solid rgba(255,255,255,0.25); padding: 14px 22px; border-radius: 999px; text-decoration: none; font-size: 14px; }
  .prod-tags { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; padding-top: 28px; border-top: 1px solid var(--dark-hairline); }
  .prod-tags span { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; border: 1px solid rgba(255,255,255,0.25); padding: 6px 12px; border-radius: 999px; opacity: 0.85; }

  @media (max-width: 900px) {
    .prod-stage { grid-template-columns: 1fr; gap: 32px; }
    .prod-caption-col { min-height: auto; }
    .prod-indicators { flex-direction: row; gap: 16px; }
  }
  @media (max-width: 768px) {
    .prod { padding: 0 var(--section-pad-x-sm) 48px; }
    .prod-pin { padding-top: 56px; min-height: auto; }
    .prod-headline { font-size: 36px; margin-bottom: 40px; }
    .prod-cta { grid-template-columns: 1fr; gap: 20px; }
  }
</style>
```

- [ ] **Step 3: ProductCard 삭제**

```bash
rm src/components/ProductCard.astro
```

- [ ] **Step 4: 정적 렌더 확인**

Run: `pnpm dev` → 브라우저 → Products 섹션 확인 (애니메이션 없이 화면 01만 보임, 나머지 stack absolute).
Run: `pnpm test --grep 'Products 정적'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(products): 정적 구조 (딥 블랙 + Mac 창 + 3 화면 컨텐츠 + CTA)"
```

---

### Task 16: Products — pinned screen-switch 타임라인

**Files:**
- Create: `src/scripts/sections/products-scrub.ts`
- Modify: `src/components/Products.astro` (script 추가)

- [ ] **Step 1: products-scrub.ts 작성**

```ts
// src/scripts/sections/products-scrub.ts
import { EASE, prefersReducedMotion, isDesktopViewport, loadGsap } from '../../lib/motion';

export async function initProductsScrub(): Promise<void> {
  const section = document.querySelector<HTMLElement>('#products');
  if (!section) return;

  if (prefersReducedMotion() || !isDesktopViewport()) {
    // 모바일 / reduced-motion: 3 화면 모두 세로로 펼치기
    section.querySelectorAll<HTMLElement>('[data-prod-screen]').forEach((el) => {
      el.style.opacity = '1';
      el.style.position = 'relative';
      el.style.inset = 'auto';
    });
    section.querySelectorAll<HTMLElement>('[data-prod-caption]').forEach((el) => { el.style.opacity = '1'; el.style.position = 'relative'; });
    return;
  }

  const { gsap } = await loadGsap();
  const pinEl = section.querySelector<HTMLElement>('.prod-pin')!;
  const screens = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-screen]'));
  const captions = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-caption]'));
  const indicators = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-indicator]'));
  const progressSegs = Array.from(section.querySelectorAll<HTMLElement>('.prod-progress .seg'));
  const windowTitle = section.querySelector<HTMLElement>('[data-prod-window-title]');
  const titles = ['TutorMate — 대시보드', 'TutorMate — 수강생', 'TutorMate — 수익'];

  // pin 구간 = 280vh
  section.style.setProperty('--pin-h', '280vh');
  pinEl.style.position = 'sticky';
  pinEl.style.top = '0';
  pinEl.style.height = '100vh';
  (section as HTMLElement).style.height = '280vh';

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  });

  function switchTo(idx: number, at: number) {
    // 현재 활성화된 것만 opacity 1, 나머지는 0
    screens.forEach((s, i) => {
      tl.to(s, { opacity: i === idx ? 1 : 0, scale: i === idx ? 1 : 1.02, duration: 0.4, ease: EASE.expo }, at);
    });
    captions.forEach((c, i) => {
      tl.to(c, { opacity: i === idx ? 1 : 0, y: i === idx ? 0 : 8, duration: 0.4, ease: EASE.smooth }, at - 0.03);
    });
    indicators.forEach((el, i) => {
      tl.call(() => { el.dataset.active = String(i === idx); }, undefined, at);
    });
    tl.call(() => {
      if (windowTitle) windowTitle.textContent = titles[idx];
      progressSegs.forEach((seg, i) => { seg.dataset.filled = String(i <= idx); });
    }, undefined, at);
  }

  switchTo(0, 0);
  switchTo(1, 0.33);
  switchTo(2, 0.66);
}
```

- [ ] **Step 2: Products.astro에 script 연결**

```astro
<script>
  import { initProductsScrub } from '../scripts/sections/products-scrub';
  initProductsScrub();
</script>
```

- [ ] **Step 3: 테스트**

```ts
test('Products 모바일 — 3 화면 세로 스택', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await context.newPage();
  await page.goto('/');
  const screens = page.locator('[data-prod-screen]');
  for (let i = 0; i < 3; i++) {
    const op = await screens.nth(i).evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(op)).toBe(1);
  }
  await context.close();
});
```

Run: `pnpm test --grep 'Products'`
Expected: PASS.

- [ ] **Step 4: 데스크톱 수동 QA**

`pnpm dev` → http://localhost:4321 → Products 섹션 스크롤하며 화면 01 → 02 → 03 교체, 캡션·인디케이터·progress·window title 동기 확인.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(products): pinned screen-switch 타임라인 (scrub + caption 동기)"
```

---

## Phase 3 — Polish & Verification

### Task 17: 섹션 진입 reveal 통합

**Files:**
- Modify: `src/scripts/scroll-animations.ts`

Hero 외 섹션 진입 시 공통 reveal 패턴 적용: eyebrow → headline → body 순 stagger.

- [ ] **Step 1: scroll-animations.ts에 reveal 유틸 추가**

```ts
// src/scripts/scroll-animations.ts 에 추가
import { prefersReducedMotion } from '../lib/motion';

export function initScrollReveals(): void {
  if (prefersReducedMotion()) return;
  const selectors = ['.phil-eyebrow, .phil-headline, .phil-grid', '.proc-eyebrow, .proc-headline, .proc-list', '.why-eyebrow, .why-headline, .why-grid', '.faq-eyebrow, .faq-headline, .faq-list', '.contact-eyebrow, .contact-headline, .contact-grid'];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).dataset.revealed = 'true';
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '-10% 0px' }
  );
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(16px)';
      (el as HTMLElement).style.transition = `opacity 0.65s var(--ease-expo) ${i * 0.08}s, transform 0.65s var(--ease-expo) ${i * 0.08}s`;
      io.observe(el);
    });
  });
  // observer callback에서 data-revealed=true 시 opacity 1, transform 0 되도록 CSS 추가
}
```

`global.css` 또는 `tokens.css`에 추가:
```css
[data-revealed='true'] { opacity: 1 !important; transform: none !important; }
```

`Base.astro`의 init 블록에서 `initScrollReveals()` 호출.

- [ ] **Step 2: 수동 QA — 스크롤 시 각 섹션 헤드 부드럽게 등장 확인**

Run: `pnpm dev`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(motion): 섹션 진입 스크롤 reveal 통합"
```

---

### Task 18: 반응형 수동 QA (Playwright 스크린샷)

**Files:**
- Create: `tests/visual-breakpoints.spec.ts`

뷰포트 4개(모바일 390, 태블릿 768, 데스크톱 1280, 와이드 1920)에서 각 섹션 풀샷.

- [ ] **Step 1: 테스트 작성**

```ts
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
      await expect(page).toHaveScreenshot(`${vp.name}-full.png`, { fullPage: true, maxDiffPixelRatio: 0.1 });
      await context.close();
    });
  }
});
```

- [ ] **Step 2: 기준 스크린샷 생성**

Run: `pnpm playwright test visual-breakpoints --update-snapshots`
Expected: 4 PNG 생성됨 → `tests/visual-breakpoints.spec.ts-snapshots/`.

- [ ] **Step 3: 시각 검수**

각 PNG 열어서:
- 모바일: Capabilities/Products pin 해제 + 세로 스택
- 태블릿: 중간 너비 깨짐 없음
- 데스크톱: 의도한 여백
- 와이드: 컨테이너 `1400px` 중앙 정렬 유지

- [ ] **Step 4: Commit**

```bash
git add tests/visual-breakpoints.spec.ts tests/visual-breakpoints.spec.ts-snapshots
git commit -m "test(visual): 4 뷰포트 풀샷 baseline"
```

---

### Task 19: 접근성 최종 검증

- [ ] **Step 1: axe-core 오디트**

Run: `pnpm test --grep 'axe'` (만약 axe 관련 테스트 없다면 아래 추가)

```ts
import AxeBuilder from '@axe-core/playwright';
test('홈 페이지 접근성 위반 없음', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

- [ ] **Step 2: 키보드 탐색 수동 확인**

탭키로 전체 페이지 순회:
- Nav 링크 → Hero CTA → Now shipping 링크 → 각 섹션 → FAQ 아코디언 (Enter/Space로 toggle) → Contact 폼 → Footer 링크
- 모든 인터랙티브 요소에 가시적 focus 링 있음

- [ ] **Step 3: reduced-motion 최종 확인**

기존 `prefers-reduced-motion` 테스트 pass + Capabilities/Products도 pinned 타임라인 동작 안 하고 3 상태 모두 즉시 노출되는지.

Run: `pnpm test --grep 'reduced-motion'`
Expected: PASS.

- [ ] **Step 4: Commit (테스트 추가한 경우)**

```bash
git add -A
git commit -m "test(a11y): axe 오디트 + 키보드/reduced-motion 회귀 방지"
```

---

### Task 20: 릴리스 전 스모크 전체 실행 + 스펙 대비 체크

- [ ] **Step 1: 전체 테스트**

Run: `pnpm test`
Expected: 모든 테스트 PASS.

- [ ] **Step 2: 빌드**

Run: `pnpm build`
Expected: 에러 없이 `dist/` 생성.

- [ ] **Step 3: preview**

Run: `pnpm preview`
브라우저 http://localhost:4321 (또는 표시된 포트)에서 전체 페이지 스크롤 — 각 섹션 톤·모션·반응형 최종 확인.

- [ ] **Step 4: 스펙 대비 최종 체크리스트**

- [ ] Hero: 워드마크 아웃라인 + EST. 2024 + Now shipping 링크
- [ ] Philosophy: 풀폭 선언문 + 하이라이트 스트립 + 3 원칙
- [ ] Capabilities: BIG → dock morph (데스크톱) / 세로 스택 (모바일)
- [ ] Process: 4 행 세로 타임라인, 가로 스크롤 없음
- [ ] Why: 2×2 헤어라인 그리드, 카테고리 eyebrow, 외주 공포 카피 제거
- [ ] Products: 딥 블랙, 3 화면 교체, CTA 스트립
- [ ] FAQ: 5 항목 아코디언, 언더라인 draw
- [ ] Contact: 80px 초대 + 4 채널 + 밑줄 폼
- [ ] Footer: 3 칼럼 + 법적 한 줄, 대형 워드마크 없음

- [ ] **Step 5: 최종 커밋 (있다면)**

남은 소폭 수정이 있으면 한 번에 커밋. 새로 만들 것 없으면 skip.

---

## Self-Review 결과

- **스펙 커버리지**: spec §§4.1~4.9 각 섹션 → Task 6~16 1:1 매핑. §§2·3 (토큰·공통 인터랙션) → Task 1, 2, 17. §§7·8 (반응형·접근성) → Task 18·19.
- **플레이스홀더 없음**: TBD·TODO 없이 각 파일에 최종 코드 블록 첨부.
- **타입 일관성**: `Capability.index` → `'01'|'02'|'03'` 유지. `WhyPromise.index` → `'01'|'02'|'03'|'04'`. 참조 모두 매칭.
- **참고 과제**: Capabilities morph의 "텍스트 좌상단 anchor 고정"은 spec·plan 둘 다 "추후 조정" 항목으로 명시. 초기 구현 이후 별도 리파인 가능.
