# Taktonlabs 랜딩페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 디자인 스펙 `docs/superpowers/specs/2026-04-09-taktonlabs-landing-design.md` 를 기반으로 Taktonlabs 회사 랜딩페이지를 구현한다. "고급·부드러움·신뢰" 세 축을 모든 컴포넌트에 뿌리내리고, Tier 2 스크롤 스토리텔링을 모바일부터 4K 화면까지 의도된 경험으로 제공한다.

**Architecture:** Astro 6 정적 사이트. Tailwind v4 `@theme` 디렉티브로 디자인 토큰 정의. GSAP + ScrollTrigger로 스크롤 드리븐 애니메이션. Lenis로 부드러운 스크롤. 통합 이징 토큰과 `prefers-reduced-motion` 폴백으로 접근성 보장. Cloudflare Pages + Email Routing으로 배포.

**Tech Stack:** Astro 6.1.5, Tailwind CSS v4 (`@tailwindcss/vite`), GSAP 3 + ScrollTrigger, Lenis, astro-icon + `@iconify-json/lucide`, Web3Forms, Cloudflare Pages, Pretendard Variable + Inter Variable (self-hosted)

**Reference:** 전체 디자인 결정·컬러·타이포·인터랙션 세부는 스펙 문서 참조. 이 플랜은 "어떻게 구현할지"에 집중한다.

---

## 파일 구조 (최종)

```
taktonlabs-web/
├── src/
│   ├── layouts/Base.astro
│   ├── pages/index.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── HexagonLogo.astro
│   │   ├── Capabilities.astro
│   │   ├── CapabilityCard.astro
│   │   ├── Products.astro
│   │   ├── ProductCard.astro
│   │   ├── TutorMateWindow.astro
│   │   ├── NoiseOverlay.astro
│   │   ├── Contact.astro
│   │   ├── ContactForm.astro
│   │   └── Footer.astro
│   ├── scripts/
│   │   ├── motion-guards.ts
│   │   ├── smooth-scroll.ts
│   │   ├── scroll-animations.ts
│   │   └── hexagon-interactive.ts
│   └── styles/
│       ├── global.css
│       └── tokens.css
├── public/
│   ├── favicon.svg
│   ├── og-image.png (수동 업로드)
│   └── fonts/
│       ├── PretendardVariable.woff2
│       └── InterVariable.woff2
├── tests/
│   └── smoke.spec.ts
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── wrangler.toml (optional)
```

---

## Task 1: 의존성 설치 & Astro 설정

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: 패키지 설치**

```bash
cd /Users/kjh/dev/taktonlabs-web
pnpm add -D @tailwindcss/vite tailwindcss @astrojs/sitemap
pnpm add astro-icon @iconify-json/lucide gsap lenis
pnpm add -D @playwright/test axe-core
```

- [ ] **Step 2: `astro.config.mjs` 교체**

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://taktonlabs.com',
  integrations: [
    icon({
      include: {
        lucide: [
          'layout-grid',
          'app-window',
          'blocks',
          'mail',
          'send',
          'arrow-right',
          'arrow-up-right',
          'chevron-down',
          'check',
        ],
      },
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: `tsconfig.json` 확장**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: 개발 서버 기동 검증**

```bash
pnpm dev
```

브라우저에서 `http://localhost:4321` 확인 — 기존 "Astro" 페이지가 여전히 뜨는지 확인 (에러 없이 구동). 확인 후 `Ctrl+C`.

- [ ] **Step 5: 커밋**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json
git commit -m "chore: Tailwind v4, astro-icon, GSAP, Lenis 설치 및 Astro 설정"
```

---

## Task 2: 디자인 토큰 & 글로벌 스타일

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: `src/styles/tokens.css` 생성**

```css
@import "tailwindcss";

@theme {
  /* ========== 컬러 팔레트 ========== */
  --color-bg: #fafaf9;
  --color-bg-alt: #f5f5f4;
  --color-bg-card: #ffffff;
  --color-bg-dark: #0a1929;
  --color-bg-dark-end: #0f2340;

  --color-text: #0a1929;
  --color-text-secondary: #57606a;
  --color-text-tertiary: #8b949e;

  --color-accent: #0891b2;
  --color-accent-mint: #5eead4;

  --color-border-soft: #e7e5e4;
  --color-border-solid: #d6d3d1;

  /* ========== 브레이크포인트 (4K까지 7단계) ========== */
  --breakpoint-2xl: 1536px;
  --breakpoint-3xl: 1920px;
  --breakpoint-4xl: 2560px;

  /* ========== 통합 이징 토큰 ========== */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);

  /* ========== 보더 라디우스 (4단계 강제) ========== */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-xl: 24px;

  /* ========== 폰트 ========== */
  --font-sans: 'Pretendard Variable', Pretendard, 'Inter Variable', Inter,
    -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;

  /* ========== 컨테이너 ========== */
  --container-narrow: 720px;   /* 본문 텍스트 블록 (65ch) */
  --container-grid: 1280px;    /* 카드 그리드 래퍼 */
  --container-wide: 1440px;    /* 섹션 최대 폭 */
}
```

- [ ] **Step 2: `src/styles/global.css` 생성**

```css
@import "./tokens.css";

/* ========== 폰트 자가 호스트 (Task 3에서 다운로드) ========== */
@font-face {
  font-family: 'Pretendard Variable';
  font-weight: 45 920;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
}

@font-face {
  font-family: 'Inter Variable';
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/InterVariable.woff2') format('woff2-variations');
}

/* ========== 기본 리셋 & 전역 설정 ========== */
:root {
  color-scheme: light;
}

html {
  scroll-behavior: smooth; /* Lenis 비활성 시 폴백 */
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-feature-settings: 'ss01', 'cv11', 'tnum';
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.005em;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  margin: 0;
  overflow-x: hidden;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 부드러움 축: 움직이는 요소는 transform만, top/left 금지 */
[data-animate] {
  will-change: transform, opacity;
}

/* 접근성: 스킵 링크 */
.skip-link {
  position: absolute;
  top: -100px;
  left: 16px;
  background: var(--color-text);
  color: var(--color-bg);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  z-index: 100;
  transition: top 0.3s var(--ease-out);
}

.skip-link:focus-visible {
  top: 16px;
}

/* 접근성: prefers-reduced-motion 폴백 (애니메이션 "단축", 비활성 아님) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 포커스 링 (모든 인터랙티브 요소 공통) */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.2);
  border-radius: var(--radius-sm);
}

/* Lucide 아이콘 스트로크 두께 1.75px 강제 (프리미엄 감각) */
[data-icon] svg,
.astro-icon svg {
  stroke-width: 1.75;
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/styles/
git commit -m "feat: 디자인 토큰 및 전역 스타일 (오프화이트, 이징, 라디우스, 4K 브레이크포인트)"
```

---

## Task 3: Pretendard & Inter Variable 폰트 자가 호스트

**Files:**
- Create: `public/fonts/PretendardVariable.woff2`
- Create: `public/fonts/InterVariable.woff2`

- [ ] **Step 1: fonts 디렉토리 생성 및 Pretendard 다운로드**

```bash
mkdir -p public/fonts
cd public/fonts
curl -L -o PretendardVariable.woff2 \
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"
cd ../..
```

- [ ] **Step 2: Inter Variable 다운로드**

```bash
cd public/fonts
curl -L -o InterVariable.woff2 \
  "https://rsms.me/inter/font-files/InterVariable.woff2"
cd ../..
```

- [ ] **Step 3: 파일 검증**

```bash
ls -la public/fonts/
```

Expected: `PretendardVariable.woff2` (~2MB), `InterVariable.woff2` (~350KB) 존재.

- [ ] **Step 4: 커밋**

```bash
git add public/fonts/
git commit -m "feat: Pretendard/Inter Variable 폰트 자가 호스트"
```

---

## Task 4: 헥사곤 로고 Favicon

**Files:**
- Create: `public/favicon.svg`
- Delete: `public/favicon.ico` (기존 Astro 기본)

- [ ] **Step 1: `public/favicon.svg` 생성**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1929"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
  </defs>
  <path
    d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
    fill="url(#hex-grad)"
  />
  <path
    d="M16 9 L16 22 M11 14 L16 9 L21 14"
    stroke="#5eead4"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
</svg>
```

- [ ] **Step 2: 기존 favicon.ico 삭제**

```bash
rm public/favicon.ico
```

- [ ] **Step 3: 커밋**

```bash
git add public/favicon.svg public/favicon.ico
git commit -m "feat: 헥사곤 로고 favicon.svg (네이비→틸 그라디언트 + 상승 화살표)"
```

---

## Task 5: Base 레이아웃

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: `src/layouts/Base.astro` 생성**

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'Taktonlabs — 제품을 만듭니다. 끝까지.',
  description = '웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오.',
  ogImage = '/og-image.png',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImageURL = new URL(ogImage, Astro.site);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Taktonlabs',
  url: 'https://taktonlabs.com',
  logo: 'https://taktonlabs.com/favicon.svg',
  description: description,
  sameAs: [],
};
---

<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="generator" content={Astro.generator} />

    <!-- Primary Meta -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Fonts preload (부드러움 축: FOUT 방지) -->
    <link
      rel="preload"
      href="/fonts/PretendardVariable.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="/fonts/InterVariable.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImageURL} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImageURL} />

    <!-- JSON-LD -->
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <a href="#main" class="skip-link">본문으로 건너뛰기</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: 커밋**

```bash
git add src/layouts/Base.astro
git commit -m "feat: Base 레이아웃 (SEO 메타, OG, JSON-LD, 폰트 preload, 스킵 링크)"
```

---

## Task 6: index.astro 스캐폴드 (Base 사용)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/pages/index.astro` 교체**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base>
  <main id="main">
    <h1 style="padding: 100px; font-size: 32px;">
      Taktonlabs scaffold — 컴포넌트 구현 대기
    </h1>
  </main>
</Base>
```

- [ ] **Step 2: 개발 서버 확인**

```bash
pnpm dev
```

`http://localhost:4321` 에서 오프화이트 배경(`#fafaf9`) + Pretendard 폰트로 "Taktonlabs scaffold" 텍스트 렌더링 확인. 개발자 도구 Network 탭에서 폰트 preload 확인. `Ctrl+C`.

- [ ] **Step 3: 커밋**

```bash
git add src/pages/index.astro
git commit -m "feat: index.astro에 Base 레이아웃 적용"
```

---

## Task 7: HexagonLogo 컴포넌트 (Nav용 미니 + Hero용 대형 3D)

**Files:**
- Create: `src/components/HexagonLogo.astro`

- [ ] **Step 1: `src/components/HexagonLogo.astro` 생성**

```astro
---
interface Props {
  size?: number;
  variant?: 'mini' | 'hero';
  class?: string;
}

const { size = 28, variant = 'mini', class: className = '' } = Astro.props;
---

<div
  class:list={['hexagon-logo', `variant-${variant}`, className]}
  style={`--size: ${size}px;`}
  aria-hidden="true"
>
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <defs>
      <linearGradient id={`hex-${variant}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1929" />
        <stop offset="100%" stop-color="#0891b2" />
      </linearGradient>
    </defs>
    <path
      d="M50 5 L88 27 L88 73 L50 95 L12 73 L12 27 Z"
      fill={`url(#hex-${variant}-grad)`}
    />
    <path
      d="M50 28 L50 70 M35 43 L50 28 L65 43"
      stroke="#5eead4"
      stroke-width="5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</div>

<style>
  .hexagon-logo {
    display: inline-flex;
    width: var(--size);
    height: var(--size);
    flex-shrink: 0;
  }

  .hexagon-logo.variant-hero {
    filter: drop-shadow(0 40px 80px rgba(10, 25, 41, 0.12));
    transform-style: preserve-3d;
    perspective: 800px;
    transition: transform 0.6s var(--ease-smooth);
  }

  .hexagon-logo.variant-hero svg {
    transform-style: preserve-3d;
    will-change: transform;
  }
</style>
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/HexagonLogo.astro
git commit -m "feat: HexagonLogo 컴포넌트 (mini/hero variant, 네이비→틸 그라디언트)"
```

---

## Task 8: Nav 컴포넌트

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: `src/components/Nav.astro` 생성**

```astro
---
import HexagonLogo from './HexagonLogo.astro';
---

<nav class="nav">
  <div class="nav-inner">
    <a href="#hero" class="brand">
      <HexagonLogo size={28} variant="mini" />
      <span class="wordmark">TAKTONLABS</span>
    </a>
    <ul class="links">
      <li><a href="#capabilities">역량</a></li>
      <li><a href="#products">제품</a></li>
      <li><a href="#contact">문의</a></li>
    </ul>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(250, 250, 249, 0.8);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .nav::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(10, 25, 41, 0.1),
      transparent
    );
  }

  .nav-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--color-text);
  }

  .wordmark {
    font-weight: 800;
    letter-spacing: 0.5px;
    font-size: 14px;
  }

  .links {
    display: flex;
    gap: 32px;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 14px;
  }

  .links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s var(--ease-in-out);
  }

  .links a:hover {
    color: var(--color-text);
  }

  @media (max-width: 640px) {
    .nav-inner {
      padding: 14px 20px;
      gap: 16px;
    }

    .wordmark {
      font-size: 12px;
    }

    .links {
      gap: 18px;
      font-size: 12px;
    }
  }

  @media (min-width: 1536px) {
    .nav-inner {
      padding: 20px 32px;
    }
  }
</style>
```

- [ ] **Step 2: index.astro에 Nav 임포트 & 사용**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
---

<Base>
  <Nav />
  <main id="main">
    <h1 style="padding: 100px; font-size: 32px;">
      Taktonlabs scaffold
    </h1>
  </main>
</Base>
```

- [ ] **Step 3: 개발 서버 확인**

```bash
pnpm dev
```

Nav가 상단에 스티키로 떠있는지, 블러 backdrop 동작하는지, 하단 1px 그라디언트 라인 보이는지, 호버 시 링크 색상 전환 부드러운지 확인. `Ctrl+C`.

- [ ] **Step 4: 커밋**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "feat: Nav 컴포넌트 (블러 backdrop + 그라디언트 라인 + 로고)"
```

---

## Task 9: Footer 컴포넌트

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: `src/components/Footer.astro` 생성**

```astro
---
import HexagonLogo from './HexagonLogo.astro';
---

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="brand">
        <HexagonLogo size={20} variant="mini" />
        <span class="wordmark">TAKTONLABS</span>
      </div>
      <p class="mission">쓰이는 소프트웨어를 끝까지 만듭니다</p>
      <div class="contact">
        <a href="mailto:hello@taktonlabs.com">hello@taktonlabs.com</a>
        <span class="sep">·</span>
        <a href="/">taktonlabs.com</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Taktonlabs</span>
      <span class="legal">
        <!-- 사업자 정보 placeholder: 대표자 · 사업자 등록번호 · 주소 표기 자리 -->
      </span>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-bg-alt);
    border-top: 1px solid var(--color-border-soft);
  }

  .footer-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
    padding: 48px 24px;
  }

  .footer-top {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 24px;
    align-items: center;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--color-border-soft);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .wordmark {
    font-weight: 800;
    letter-spacing: 0.5px;
    font-size: 13px;
    color: var(--color-text);
  }

  .mission {
    color: var(--color-text-secondary);
    font-size: 13px;
    margin: 0;
    text-align: center;
  }

  .contact {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .contact a {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s var(--ease-in-out);
  }

  .contact a:hover {
    color: var(--color-accent);
  }

  .contact .sep {
    margin: 0 8px;
    color: var(--color-text-tertiary);
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    padding-top: 24px;
    font-size: 12px;
    color: var(--color-text-tertiary);
  }

  @media (max-width: 768px) {
    .footer-top {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .mission {
      text-align: center;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }
  }
</style>
```

- [ ] **Step 2: index.astro에 Footer 추가**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---

<Base>
  <Nav />
  <main id="main">
    <h1 style="padding: 100px; font-size: 32px;">
      Taktonlabs scaffold
    </h1>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 3: 개발 서버 확인**

Footer 영역이 페이지 하단에 뜨고, 모바일(개발자 도구 360px)에서 세로 스택으로 전환되는지 확인.

- [ ] **Step 4: 커밋**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: Footer (미션 카피, 연락처, 사업자 정보 placeholder)"
```

---

## Task 10: Hero 컴포넌트 (정적 마크업)

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: `src/components/Hero.astro` 생성**

```astro
---
import HexagonLogo from './HexagonLogo.astro';
import { Icon } from 'astro-icon/components';
---

<section id="hero" class="hero">
  <div class="hero-inner">
    <div class="hero-content">
      <h1 class="headline">
        <span class="word" data-word="0">제품을</span>
        <span class="word" data-word="1">만듭니다.</span>
        <span class="word word-accent" data-word="2">끝까지.</span>
      </h1>
      <p class="subcopy">
        웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오.
      </p>
      <div class="ctas">
        <a href="#products" class="cta cta-primary">
          <span>제품 둘러보기</span>
          <Icon name="lucide:arrow-right" width={18} height={18} />
        </a>
        <a href="#contact" class="cta cta-secondary">
          <span>문의하기</span>
        </a>
      </div>
    </div>
    <div class="hero-visual">
      <HexagonLogo size={220} variant="hero" class="hero-hexagon" />
    </div>
  </div>
  <div class="hero-bg-mesh" aria-hidden="true"></div>
</section>

<style>
  .hero {
    position: relative;
    padding: 96px 24px 120px;
    overflow: hidden;
  }

  .hero-inner {
    position: relative;
    max-width: var(--container-wide);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 48px;
    align-items: center;
    z-index: 1;
  }

  .hero-content {
    min-width: 0;
  }

  .headline {
    font-size: clamp(34px, 7vw, 84px);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0 0 24px;
    color: var(--color-text);
  }

  .word {
    display: inline-block;
  }

  .word-accent {
    background: linear-gradient(135deg, #0a1929 0%, #0891b2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subcopy {
    font-size: clamp(15px, 1.3vw, 19px);
    color: var(--color-text-secondary);
    line-height: 1.75;
    max-width: 560px;
    margin: 0 0 32px;
  }

  .ctas {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition:
      transform 0.3s var(--ease-in-out),
      box-shadow 0.3s var(--ease-in-out),
      background-color 0.3s var(--ease-in-out);
  }

  .cta-primary {
    background: var(--color-text);
    color: var(--color-bg);
    box-shadow: 0 4px 12px rgba(10, 25, 41, 0.12);
  }

  .cta-primary:hover {
    box-shadow: 0 8px 24px rgba(10, 25, 41, 0.2);
    transform: translate3d(0, -2px, 0);
  }

  .cta-secondary {
    background: transparent;
    color: var(--color-text);
    border: 1.5px solid var(--color-border-solid);
  }

  .cta-secondary:hover {
    border-color: var(--color-text);
    transform: translate3d(0, -2px, 0);
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-bg-mesh {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 20% 20%, rgba(8, 145, 178, 0.05), transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(94, 234, 212, 0.04), transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* ========== 반응형 ========== */
  @media (max-width: 768px) {
    .hero {
      padding: 64px 20px 72px;
    }

    .hero-inner {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 32px;
    }

    .hero-visual {
      order: -1;
    }

    .subcopy {
      margin-left: auto;
      margin-right: auto;
    }

    .ctas {
      justify-content: center;
    }
  }

  @media (min-width: 1536px) {
    .hero {
      padding: 160px 32px 192px;
    }

    .hero-inner {
      gap: 64px;
    }
  }

  @media (min-width: 1920px) {
    .hero {
      padding: 192px 48px 224px;
    }
  }
</style>
```

- [ ] **Step 2: 모바일 헥사곤 사이즈 축소 (인라인 스크립트로 뷰포트 감지)**

Hero.astro에 아래 `<script>` 블록 추가 (`</style>` 바로 위, 즉 `</section>` 다음):

```astro
<script>
  // 모바일에서 헥사곤 크기 축소 (140 → 100px)
  function adjustHexagonSize() {
    const hex = document.querySelector('.hero-hexagon');
    if (!hex) return;
    const svg = hex.querySelector('svg');
    if (!svg) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const size = isMobile ? 100 : 220;
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    (hex as HTMLElement).style.setProperty('--size', `${size}px`);
  }
  adjustHexagonSize();
  window.addEventListener('resize', adjustHexagonSize);
</script>
```

- [ ] **Step 3: index.astro에 Hero 통합**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Footer from '../components/Footer.astro';
---

<Base>
  <Nav />
  <main id="main">
    <Hero />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: 개발 서버 확인**

`pnpm dev` → 헤드라인 "제품을 만듭니다. 끝까지." 가 큰 폰트로, "끝까지." 가 그라디언트 적용된 상태로 렌더링. 우측에 3D 헥사곤 로고. CTA 2개 호버 시 그림자 상승 + 2px 올라옴. 모바일(360px) 에서 세로 스택 + 헥사곤 위로 이동.

- [ ] **Step 5: 커밋**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: Hero 컴포넌트 (정적) — 헤드라인, 서브카피, CTA, 3D 헥사곤 + 배경 메시"
```

---

## Task 11: CapabilityCard & Capabilities 컴포넌트

**Files:**
- Create: `src/components/CapabilityCard.astro`
- Create: `src/components/Capabilities.astro`

- [ ] **Step 1: `src/components/CapabilityCard.astro` 생성**

```astro
---
import { Icon } from 'astro-icon/components';

interface Props {
  iconName: string;
  title: string;
  description: string;
  index: number;
}

const { iconName, title, description, index } = Astro.props;
---

<article class="capability-card" data-card-index={index}>
  <div class="icon-wrap">
    <Icon name={iconName} width={24} height={24} />
  </div>
  <h3 class="title">{title}</h3>
  <p class="description">{description}</p>
</article>

<style>
  .capability-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-lg);
    padding: 32px;
    box-shadow: 0 1px 2px rgba(10, 25, 41, 0.04);
    transition:
      border-color 0.4s var(--ease-in-out),
      box-shadow 0.6s var(--ease-smooth),
      transform 0.6s var(--ease-smooth),
      opacity 0.4s var(--ease-in-out);
    will-change: transform, box-shadow;
  }

  .capability-card:hover {
    border-color: var(--color-accent);
    box-shadow: 0 12px 28px rgba(10, 25, 41, 0.1);
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(8, 145, 178, 0.08);
    border-radius: var(--radius-md);
    margin-bottom: 20px;
    color: var(--color-accent);
    transition: background-color 0.4s var(--ease-in-out);
  }

  .capability-card[data-active='true'] {
    border-color: var(--color-accent);
    box-shadow: 0 20px 48px rgba(10, 25, 41, 0.12);
    transform: translate3d(0, 0, 0) scale3d(1.02, 1.02, 1);
  }

  .capability-card[data-active='true'] .icon-wrap {
    background: rgba(8, 145, 178, 0.15);
  }

  .capability-card[data-dimmed='true'] {
    opacity: 0.4;
  }

  .title {
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--color-text);
    margin: 0 0 10px;
  }

  .description {
    font-size: 14px;
    line-height: 1.65;
    color: var(--color-text-secondary);
    margin: 0;
  }

  @media (min-width: 1536px) {
    .capability-card {
      padding: 40px;
    }

    .icon-wrap {
      width: 56px;
      height: 56px;
    }

    .title {
      font-size: 21px;
    }

    .description {
      font-size: 15px;
    }
  }
</style>
```

- [ ] **Step 2: `src/components/Capabilities.astro` 생성**

```astro
---
import CapabilityCard from './CapabilityCard.astro';

const cards = [
  {
    iconName: 'lucide:layout-grid',
    title: '웹·모바일 제품',
    description:
      'SaaS, 웹앱, 반응형 사이트. 기획 · 디자인 · 개발 · 배포까지 한 팀에서.',
  },
  {
    iconName: 'lucide:app-window',
    title: '데스크톱 앱',
    description:
      'Electron 기반 크로스플랫폼. 자동 업데이트 · 코드 사이닝 · 배포까지.',
  },
  {
    iconName: 'lucide:blocks',
    title: 'B2B 맞춤 개발',
    description:
      '업무 흐름을 이해하고 거기에 맞는 도구를 만듭니다.',
  },
];
---

<section id="capabilities" class="capabilities">
  <div class="capabilities-inner">
    <div class="capabilities-header">
      <p class="label">핵심 역량</p>
      <h2 class="title">세 가지 영역에서 끝까지 만듭니다</h2>
      <p class="subcopy">하나를 만들어도 처음부터 끝까지 직접 합니다.</p>
    </div>
    <div class="card-grid">
      {cards.map((card, i) => <CapabilityCard {...card} index={i} />)}
    </div>
  </div>
</section>

<style>
  .capabilities {
    background: var(--color-bg-alt);
    padding: 96px 24px;
  }

  .capabilities-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
  }

  .capabilities-header {
    text-align: center;
    margin-bottom: 64px;
    max-width: var(--container-narrow);
    margin-left: auto;
    margin-right: auto;
  }

  .label {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  .title {
    font-size: clamp(24px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.2;
  }

  .subcopy {
    font-size: clamp(15px, 1.3vw, 19px);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .card-grid {
    max-width: var(--container-grid);
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (max-width: 768px) {
    .capabilities {
      padding: 72px 20px;
    }

    .capabilities-header {
      margin-bottom: 40px;
    }

    .card-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  @media (min-width: 1536px) {
    .capabilities {
      padding: 160px 32px;
    }

    .card-grid {
      gap: 32px;
    }
  }

  @media (min-width: 1920px) {
    .capabilities {
      padding: 192px 48px;
    }

    .card-grid {
      gap: 48px;
    }
  }
</style>
```

- [ ] **Step 3: index.astro에 Capabilities 추가**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Capabilities from '../components/Capabilities.astro';
import Footer from '../components/Footer.astro';
---

<Base>
  <Nav />
  <main id="main">
    <Hero />
    <Capabilities />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: 개발 서버 확인**

역량 섹션: 3개 카드 가로 그리드(데스크톱) / 세로 스택(모바일). 호버 시 테두리 틸 컬러 시프트 + 그림자 상승.

- [ ] **Step 5: 커밋**

```bash
git add src/components/CapabilityCard.astro src/components/Capabilities.astro src/pages/index.astro
git commit -m "feat: Capabilities 섹션 (3카드 그리드, Lucide 아이콘, hover 시프트)"
```

---

## Task 12: NoiseOverlay 컴포넌트

**Files:**
- Create: `src/components/NoiseOverlay.astro`

- [ ] **Step 1: `src/components/NoiseOverlay.astro` 생성**

```astro
---
// SVG feTurbulence 기반 노이즈 오버레이 (다크 블록에 "손으로 만든" 질감 부여)
---

<div class="noise-overlay" aria-hidden="true">
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <filter id="noise-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 0.5 0"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise-filter)" />
  </svg>
</div>

<style>
  .noise-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    mix-blend-mode: overlay;
    z-index: 0;
  }

  .noise-overlay svg {
    width: 100%;
    height: 100%;
  }
</style>
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/NoiseOverlay.astro
git commit -m "feat: NoiseOverlay 컴포넌트 (SVG feTurbulence 2~3% 다크 블록 질감)"
```

---

## Task 13: TutorMateWindow 컴포넌트

**Files:**
- Create: `src/components/TutorMateWindow.astro`

- [ ] **Step 1: `src/components/TutorMateWindow.astro` 생성**

```astro
---
// TutorMate 앱 윈도우 스타일라이즈 목업 (제품 섹션용)
---

<div class="app-window" data-window>
  <div class="window-header">
    <div class="dots">
      <span class="dot dot-red" data-window-dot></span>
      <span class="dot dot-yellow" data-window-dot></span>
      <span class="dot dot-green" data-window-dot></span>
    </div>
    <div class="title-bar">TutorMate</div>
  </div>
  <div class="window-body">
    <div class="sidebar" data-window-section>
      <div class="sidebar-item active"></div>
      <div class="sidebar-item"></div>
      <div class="sidebar-item"></div>
      <div class="sidebar-item"></div>
    </div>
    <div class="content" data-window-section>
      <div class="content-header">
        <div class="header-text"></div>
        <div class="header-button"></div>
      </div>
      <div class="stats">
        <div class="stat-card" data-window-card></div>
        <div class="stat-card" data-window-card></div>
        <div class="stat-card" data-window-card></div>
      </div>
      <div class="list">
        <div class="list-item" data-window-row></div>
        <div class="list-item" data-window-row></div>
        <div class="list-item" data-window-row></div>
      </div>
    </div>
  </div>
</div>

<style>
  .app-window {
    background: linear-gradient(135deg, #1a2f4a 0%, #0a1929 100%);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
    will-change: transform;
    transform: translate3d(0, 0, 0) scale3d(0.95, 0.95, 1);
    opacity: 0;
  }

  .window-header {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot-red { background: #ef4444; }
  .dot-yellow { background: #f59e0b; }
  .dot-green { background: #10b981; }

  .title-bar {
    flex: 1;
    text-align: center;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .window-body {
    display: grid;
    grid-template-columns: 120px 1fr;
    min-height: 280px;
  }

  .sidebar {
    background: rgba(0, 0, 0, 0.2);
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }

  .sidebar-item {
    height: 28px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 6px;
  }

  .sidebar-item.active {
    background: rgba(94, 234, 212, 0.15);
  }

  .content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .header-text {
    flex: 1;
    height: 24px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 4px;
  }

  .header-button {
    width: 80px;
    height: 24px;
    background: rgba(94, 234, 212, 0.2);
    border-radius: 6px;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .stat-card {
    height: 56px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .list-item {
    height: 22px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .window-body {
      grid-template-columns: 80px 1fr;
      min-height: 220px;
    }

    .content {
      padding: 14px;
    }
  }
</style>
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/TutorMateWindow.astro
git commit -m "feat: TutorMateWindow 스타일라이즈 앱 윈도우 목업 (reveal 대상 data attribute)"
```

---

## Task 14: ProductCard & Products 컴포넌트

**Files:**
- Create: `src/components/ProductCard.astro`
- Create: `src/components/Products.astro`

- [ ] **Step 1: `src/components/ProductCard.astro` 생성**

```astro
---
import { Icon } from 'astro-icon/components';
import TutorMateWindow from './TutorMateWindow.astro';

interface Props {
  label: string;
  name: string;
  description: string;
  tags: string[];
  ctaHref: string;
  ctaLabel: string;
}

const { label, name, description, tags, ctaHref, ctaLabel } = Astro.props;
---

<article class="product-card">
  <div class="info">
    <p class="label" data-reveal>{label}</p>
    <h3 class="name" data-reveal>{name}</h3>
    <p class="description" data-reveal>{description}</p>
    <div class="tags" data-reveal>
      {tags.map((tag) => <span class="tag" data-tag>{tag}</span>)}
    </div>
    <a href={ctaHref} class="cta" data-reveal>
      <span>{ctaLabel}</span>
      <Icon name="lucide:arrow-up-right" width={16} height={16} />
    </a>
  </div>
  <div class="visual">
    <TutorMateWindow />
  </div>
</article>

<style>
  .product-card {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 32px;
    align-items: center;
    padding: 40px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(94, 234, 212, 0.15);
    border-radius: var(--radius-lg);
    max-width: var(--container-grid);
    margin: 0 auto;
  }

  .label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent-mint);
    margin: 0 0 10px;
  }

  .name {
    font-size: 28px;
    font-weight: 900;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: -0.02em;
  }

  .description {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 20px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  .tag {
    padding: 6px 14px;
    background: rgba(94, 234, 212, 0.12);
    color: var(--color-accent-mint);
    border-radius: var(--radius-xl);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    will-change: transform;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-accent-mint);
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    transition: gap 0.3s var(--ease-in-out);
  }

  .cta:hover {
    gap: 10px;
  }

  @media (max-width: 900px) {
    .product-card {
      grid-template-columns: 1fr;
      padding: 32px 24px;
      gap: 24px;
    }

    .visual {
      order: 2;
    }

    .info {
      order: 1;
    }
  }

  @media (min-width: 1536px) {
    .product-card {
      padding: 56px;
      gap: 48px;
    }

    .name {
      font-size: 32px;
    }
  }
</style>
```

- [ ] **Step 2: `src/components/Products.astro` 생성**

```astro
---
import ProductCard from './ProductCard.astro';
import NoiseOverlay from './NoiseOverlay.astro';
---

<section id="products" class="products">
  <div class="mint-line" data-mint-line></div>
  <NoiseOverlay />
  <div class="products-inner">
    <div class="products-header">
      <p class="label">제품</p>
      <h2 class="title">이론이 아닙니다. 실제로 만들고 운영합니다.</h2>
      <p class="subcopy">현재 출시 · 운영 중인 제품</p>
    </div>
    <ProductCard
      label="주력 제품"
      name="TutorMate"
      description="60대 이상 강사의 수강 관리를 쉽게. 수강생 · 결제 · 대시보드까지 직관적으로."
      tags={['Electron', 'Win · Mac', '자동 업데이트']}
      ctaHref="#"
      ctaLabel="자세히 보기"
    />
  </div>
</section>

<style>
  .products {
    position: relative;
    background: linear-gradient(180deg, #0a1929 0%, #0f2340 100%);
    padding: 120px 24px;
    overflow: hidden;
  }

  .mint-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(94, 234, 212, 0.4),
      transparent
    );
    transform-origin: left center;
    will-change: transform;
  }

  .products-inner {
    position: relative;
    max-width: var(--container-wide);
    margin: 0 auto;
    z-index: 1;
  }

  .products-header {
    text-align: center;
    margin-bottom: 64px;
    max-width: var(--container-narrow);
    margin-left: auto;
    margin-right: auto;
  }

  .label {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent-mint);
    margin: 0 0 12px;
  }

  .title {
    font-size: clamp(24px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 12px;
    line-height: 1.2;
  }

  .subcopy {
    font-size: clamp(15px, 1.3vw, 19px);
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
  }

  @media (max-width: 768px) {
    .products {
      padding: 72px 20px;
    }

    .products-header {
      margin-bottom: 40px;
    }
  }

  @media (min-width: 1536px) {
    .products {
      padding: 160px 32px;
    }
  }

  @media (min-width: 1920px) {
    .products {
      padding: 192px 48px;
    }
  }
</style>
```

- [ ] **Step 3: index.astro에 Products 추가**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Capabilities from '../components/Capabilities.astro';
import Products from '../components/Products.astro';
import Footer from '../components/Footer.astro';
---

<Base>
  <Nav />
  <main id="main">
    <Hero />
    <Capabilities />
    <Products />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: 개발 서버 확인**

제품 섹션: 다크 네이비 배경 + 민트 상단 라인 + 노이즈 오버레이(희미하게 보임) + TutorMate 카드 좌우 2열 (데스크톱) / 세로 스택 (모바일). 앱 윈도우 목업은 `opacity: 0` 상태로 숨겨져 있음 (나중에 reveal 애니메이션에서 복구).

**임시:** 스크롤 애니메이션 구현 전 TutorMateWindow의 `opacity: 0`과 `scale(0.95)`를 일시적으로 제거해야 현재 단계에서 보임. 확인용으로만 잠깐 주석 처리하고 원복하세요.

- [ ] **Step 5: 커밋**

```bash
git add src/components/ProductCard.astro src/components/Products.astro src/pages/index.astro
git commit -m "feat: Products 섹션 (다크 블록, 민트 라인, 노이즈, TutorMate 카드)"
```

---

## Task 15: ContactForm & Contact 컴포넌트

**Files:**
- Create: `src/components/ContactForm.astro`
- Create: `src/components/Contact.astro`

- [ ] **Step 1: `src/components/ContactForm.astro` 생성**

```astro
---
// Web3Forms 무백엔드 폼 (access key는 빌드/환경변수로 주입)
const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY';
---

<form class="contact-form" data-contact-form>
  <input type="hidden" name="access_key" value={accessKey} />
  <input type="hidden" name="from_name" value="Taktonlabs 문의 폼" />
  <input type="hidden" name="subject" value="[Taktonlabs] 새 문의" />

  <!-- 허니팟 (스팸 방지) -->
  <input type="checkbox" name="botcheck" class="honeypot" tabindex="-1" autocomplete="off" />

  <div class="field-row">
    <div class="field">
      <label for="contact-name">이름 <span class="required">*</span></label>
      <input
        id="contact-name"
        name="name"
        type="text"
        required
        aria-required="true"
        autocomplete="name"
      />
    </div>
    <div class="field">
      <label for="contact-email">이메일 <span class="required">*</span></label>
      <input
        id="contact-email"
        name="email"
        type="email"
        required
        aria-required="true"
        autocomplete="email"
      />
    </div>
  </div>

  <div class="field-row">
    <div class="field">
      <label for="contact-company">회사명</label>
      <input
        id="contact-company"
        name="company"
        type="text"
        autocomplete="organization"
      />
    </div>
    <div class="field">
      <label for="contact-budget">예산 범위</label>
      <select id="contact-budget" name="budget">
        <option value="">선택해주세요</option>
        <option>500만원 이하</option>
        <option>500만원 ~ 2,000만원</option>
        <option>2,000만원 ~ 5,000만원</option>
        <option>5,000만원 이상</option>
        <option>미정</option>
      </select>
    </div>
  </div>

  <div class="field">
    <label for="contact-message">프로젝트 내용 <span class="required">*</span></label>
    <textarea
      id="contact-message"
      name="message"
      required
      aria-required="true"
      rows="5"
    ></textarea>
  </div>

  <button type="submit" class="submit-btn" data-submit-btn>
    <span class="btn-text">문의 보내기</span>
  </button>

  <div class="form-status" data-form-status aria-live="polite"></div>
</form>

<div class="success-state" data-success-state hidden>
  <svg class="check-mark" viewBox="0 0 52 52" width="56" height="56">
    <circle cx="26" cy="26" r="24" stroke="#5eead4" stroke-width="2" fill="none" />
    <path
      d="M14 27 L22 35 L38 17"
      stroke="#5eead4"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      class="check-path"
    />
  </svg>
  <h3 class="success-title">연락드리겠습니다</h3>
  <p class="success-text">빠른 시일 내에 답변 드릴게요.</p>
</div>

<style>
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .honeypot {
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-accent-mint);
  }

  .required {
    color: #f87171;
    margin-left: 2px;
  }

  input,
  select,
  textarea {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 10px 0;
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition:
      border-color 0.4s var(--ease-in-out),
      box-shadow 0.4s var(--ease-in-out);
  }

  select option {
    background: #0a1929;
    color: #fff;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: var(--color-accent-mint);
    box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.15);
    transition:
      border-color 0.4s var(--ease-in-out),
      box-shadow 0.4s var(--ease-in-out);
  }

  .submit-btn {
    margin-top: 8px;
    padding: 14px 28px;
    background: var(--color-accent-mint);
    color: #0a1929;
    border: none;
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    transition:
      transform 0.3s var(--ease-in-out),
      box-shadow 0.3s var(--ease-in-out);
  }

  .submit-btn:hover {
    transform: translate3d(0, -2px, 0);
    box-shadow: 0 8px 24px rgba(94, 234, 212, 0.2);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .form-status {
    font-size: 13px;
    color: #f87171;
    min-height: 20px;
  }

  .success-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 48px 16px;
    gap: 12px;
  }

  .success-title {
    color: #fff;
    font-size: 20px;
    font-weight: 800;
    margin: 0;
  }

  .success-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    margin: 0;
  }

  .check-path {
    stroke-dasharray: 60;
    stroke-dashoffset: 60;
  }

  .success-state[data-animate='true'] .check-path {
    animation: draw 0.8s var(--ease-out) forwards;
  }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }

  @media (max-width: 640px) {
    .field-row {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const status = document.querySelector<HTMLElement>('[data-form-status]');
  const submitBtn = document.querySelector<HTMLButtonElement>('[data-submit-btn]');
  const successState = document.querySelector<HTMLElement>('[data-success-state]');

  if (form && status && submitBtn && successState) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = '';
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text')!.textContent = '보내는 중…';

      const formData = new FormData(form);
      const jsonObject: Record<string, FormDataEntryValue> = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(jsonObject),
        });

        const result = await res.json();

        if (result.success) {
          form.style.display = 'none';
          successState.removeAttribute('hidden');
          successState.setAttribute('data-animate', 'true');
        } else {
          status.textContent = result.message || '전송에 실패했습니다. 다시 시도해주세요.';
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text')!.textContent = '문의 보내기';
        }
      } catch (error) {
        status.textContent = '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text')!.textContent = '문의 보내기';
      }
    });
  }
</script>
```

- [ ] **Step 2: `src/components/Contact.astro` 생성**

```astro
---
import { Icon } from 'astro-icon/components';
import ContactForm from './ContactForm.astro';
---

<section id="contact" class="contact">
  <div class="contact-inner">
    <div class="contact-header">
      <p class="label">문의</p>
      <h2 class="title">프로젝트 이야기하러 오세요</h2>
      <p class="subcopy">작은 프로젝트도, 큰 프로젝트도 환영합니다.</p>
    </div>
    <div class="contact-grid">
      <a href="mailto:hello@taktonlabs.com" class="card card-email">
        <div class="card-icon"><Icon name="lucide:mail" width={28} height={28} /></div>
        <p class="card-label">이메일</p>
        <p class="card-title">hello@taktonlabs.com</p>
        <p class="card-description">가볍게 안부, 질문 환영</p>
      </a>
      <div class="card card-form">
        <div class="card-icon-dark">
          <Icon name="lucide:send" width={28} height={28} />
        </div>
        <p class="card-label-dark">문의 폼</p>
        <h3 class="card-title-dark">정식 문의</h3>
        <p class="card-description-dark">프로젝트 내용을 자세히</p>
        <div class="form-wrap">
          <ContactForm />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact {
    background: var(--color-bg);
    padding: 120px 24px;
  }

  .contact-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
  }

  .contact-header {
    text-align: center;
    margin-bottom: 64px;
    max-width: var(--container-narrow);
    margin-left: auto;
    margin-right: auto;
  }

  .label {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  .title {
    font-size: clamp(24px, 4vw, 42px);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.2;
  }

  .subcopy {
    font-size: clamp(15px, 1.3vw, 19px);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .contact-grid {
    max-width: var(--container-grid);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.8fr;
    gap: 24px;
    align-items: flex-start;
  }

  .card {
    border-radius: var(--radius-lg);
    padding: 40px;
    transition:
      border-color 0.4s var(--ease-in-out),
      box-shadow 0.4s var(--ease-in-out),
      transform 0.4s var(--ease-in-out);
  }

  .card-email {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-soft);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card-email:hover {
    border-color: var(--color-accent);
    box-shadow: 0 12px 28px rgba(10, 25, 41, 0.08);
    transform: translate3d(0, -2px, 0);
  }

  .card-icon {
    width: 48px;
    height: 48px;
    background: rgba(8, 145, 178, 0.08);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
    margin-bottom: 12px;
  }

  .card-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0;
  }

  .card-title {
    font-size: 17px;
    font-weight: 800;
    color: var(--color-text);
    margin: 0;
  }

  .card-description {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .card-form {
    background: #0a1929;
    color: #fff;
  }

  .card-icon-dark {
    width: 48px;
    height: 48px;
    background: rgba(94, 234, 212, 0.12);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-mint);
    margin-bottom: 16px;
  }

  .card-label-dark {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent-mint);
    margin: 0 0 8px;
  }

  .card-title-dark {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .card-description-dark {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 28px;
  }

  @media (max-width: 900px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }

    .card {
      padding: 32px 24px;
    }
  }

  @media (max-width: 640px) {
    .contact {
      padding: 72px 20px;
    }
  }

  @media (min-width: 1536px) {
    .contact {
      padding: 160px 32px;
    }
  }

  @media (min-width: 1920px) {
    .contact {
      padding: 192px 48px;
    }
  }
</style>
```

- [ ] **Step 3: index.astro에 Contact 추가**

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Capabilities from '../components/Capabilities.astro';
import Products from '../components/Products.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<Base>
  <Nav />
  <main id="main">
    <Hero />
    <Capabilities />
    <Products />
    <Contact />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: 개발 서버 확인**

문의 섹션: 좌측 이메일 카드(흰 배경), 우측 네이비 폼 카드. 모든 입력 필드 포커스 시 민트 언더라인 + 4px 소프트 링. 제출 버튼 hover 시 살짝 올라옴.

- [ ] **Step 5: 커밋**

```bash
git add src/components/ContactForm.astro src/components/Contact.astro src/pages/index.astro
git commit -m "feat: Contact 섹션 (이메일 카드 + 네이비 폼 카드, Web3Forms 통합, 포커스 링)"
```

---

## Task 16: 정적 마크업 최종 반응형 검증

**Files:**
- None (검증만)

- [ ] **Step 1: 개발 서버 기동 + 8개 브레이크포인트 시각적 점검**

```bash
pnpm dev
```

개발자 도구 반응형 모드에서 다음 너비로 전 섹션 점검. 각 뷰포트에서:
- 레이아웃 깨짐 없음
- 수평 스크롤바 없음 (overflow-x)
- 글자 겹침/잘림 없음
- 터치 타겟 44px 이상

| 뷰포트 | 점검 포인트 |
|---|---|
| 360px | Nav 링크 보임, 모든 섹션 세로 스택, Hero 헥사곤 위로 |
| 640px | Capabilities 1열 유지, 폼 필드 1열 |
| 768px | Hero 여전히 세로, Products 카드 여전히 세로 |
| 1024px | Hero 2열 시작, Capabilities 3열 시작 |
| 1280px | 모든 섹션 가로 레이아웃 완성 |
| 1536px | 섹션 패딩 확장 (160px), 카드 gap 확장 |
| 1920px | 패딩 192px, 중앙 프레임 뚜렷 |
| 2560px | 콘텐츠 1440px 중앙, 양옆 의도된 여백 |

- [ ] **Step 2: 발견된 이슈 수정**

이슈 발견 시 각 컴포넌트 CSS 수정. 흔한 이슈:
- `overflow-x` 발생 → 컨테이너에 `max-width: 100%` 추가
- 버튼 텍스트 줄바꿈 → `white-space: nowrap`
- 이미지/SVG 넘침 → `max-width: 100%`

- [ ] **Step 3: 커밋 (수정사항 있으면)**

```bash
git add -u
git commit -m "fix: 반응형 레이아웃 이슈 수정 (360px ~ 2560px 검증 완료)"
```

수정이 없으면 skip.

---

## Task 17: motion-guards 스크립트

**Files:**
- Create: `src/scripts/motion-guards.ts`

- [ ] **Step 1: `src/scripts/motion-guards.ts` 생성**

```typescript
/**
 * prefers-reduced-motion 및 디바이스 호버 기능 감지 유틸리티.
 * 모든 인터랙션 스크립트가 진입 시 가드로 사용.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 1024px)').matches;
}

/**
 * matchMedia 변경 감지 헬퍼. 리스너 해제 함수 반환.
 */
export function watchMediaQuery(
  query: string,
  callback: (matches: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia(query);
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  callback(mq.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/scripts/motion-guards.ts
git commit -m "feat: motion-guards 유틸리티 (reduced-motion/hover/desktop 감지)"
```

---

## Task 18: Lenis 스무스 스크롤 스크립트

**Files:**
- Create: `src/scripts/smooth-scroll.ts`

- [ ] **Step 1: `src/scripts/smooth-scroll.ts` 생성**

```typescript
import Lenis from 'lenis';
import { prefersReducedMotion } from './motion-guards';

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  // 접근성: reduced-motion 시 네이티브 스크롤 사용
  if (prefersReducedMotion()) {
    return null;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => 1 - Math.pow(1 - t, 3), // 3차 감속 (부드러움 축)
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Nav 앵커 클릭 Lenis에 위임
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });

  lenisInstance = lenis;
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/scripts/smooth-scroll.ts
git commit -m "feat: Lenis 스무스 스크롤 초기화 (1.2s 3차 감속, 앵커 위임, reduced-motion 폴백)"
```

---

## Task 19: scroll-animations 스크립트 (GSAP 전역 설정 + 진입 애니메이션)

**Files:**
- Create: `src/scripts/scroll-animations.ts`

- [ ] **Step 1: `src/scripts/scroll-animations.ts` 생성**

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isDesktop } from './motion-guards';
import { getLenis } from './smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

// ========== GSAP 전역 기본값 (부드러움 축) ==========
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// Lenis와 ScrollTrigger 동기화
function syncLenisWithScrollTrigger() {
  const lenis = getLenis();
  if (!lenis) return;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/**
 * 모든 스크롤 애니메이션 진입점. DOM 로드 후 호출.
 */
export function initScrollAnimations(): void {
  if (prefersReducedMotion()) {
    // reduced-motion: 모든 요소 즉시 완료 상태로 표시 (레이아웃 유지)
    showAllImmediately();
    return;
  }

  syncLenisWithScrollTrigger();

  animateHero();
  animateSectionHeaders();
  animateCapabilities();
  animateProductsSection();
  animateContact();
}

/**
 * reduced-motion 폴백: 숨겨진 요소들을 즉시 표시.
 */
function showAllImmediately(): void {
  // Hero 단어
  gsap.set('.word', { opacity: 1, y: 0 });
  // 앱 윈도우
  gsap.set('[data-window]', { opacity: 1, scale: 1 });
  // 민트 라인
  gsap.set('[data-mint-line]', { scaleX: 1 });
  // Reveal 대상
  gsap.set('[data-reveal]', { opacity: 1, y: 0 });
}

/**
 * Hero: 단어 단위 페이드인 + 서브카피/CTA stagger
 */
function animateHero(): void {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 단어 stagger
  tl.from('.headline .word', {
    y: 16,
    opacity: 0,
    duration: 0.9,
    stagger: 0.08,
  });

  // 서브카피
  tl.from(
    '.subcopy',
    {
      y: 16,
      opacity: 0,
      duration: 0.8,
    },
    '+=0.2'
  );

  // CTA 2개
  tl.from(
    '.ctas .cta',
    {
      y: 12,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
    },
    '-=0.4'
  );

  // 헥사곤 (등장)
  tl.from(
    '.hero-hexagon svg',
    {
      opacity: 0,
      scale: 1.2,
      duration: 1.2,
      ease: 'power2.out',
    },
    0.1
  );
}

/**
 * 섹션 헤더 (라벨/제목/서브카피): 진입 시 fade + slide up
 */
function animateSectionHeaders(): void {
  const headers = document.querySelectorAll(
    '#capabilities .capabilities-header, #products .products-header, #contact .contact-header'
  );

  headers.forEach((header) => {
    gsap.from(header.children, {
      y: 24,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

/**
 * 핵심 역량: 데스크톱은 pin + 순차 활성화, 모바일은 IntersectionObserver 진입
 */
function animateCapabilities(): void {
  const section = document.querySelector('#capabilities');
  const cards = document.querySelectorAll<HTMLElement>('.capability-card');
  if (!section || cards.length === 0) return;

  if (isDesktop()) {
    // 데스크톱: pin + 스크롤 진행도에 따라 카드 순차 활성화
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: '+=150%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, i) => {
      tl.call(() => {
        cards.forEach((c, j) => {
          if (j === i) {
            c.setAttribute('data-active', 'true');
            c.removeAttribute('data-dimmed');
          } else {
            c.removeAttribute('data-active');
            c.setAttribute('data-dimmed', 'true');
          }
        });
      }, [], i * 0.33);
    });

    // 섹션 끝: 모든 카드 정상 복귀
    tl.call(() => {
      cards.forEach((c) => {
        c.removeAttribute('data-active');
        c.removeAttribute('data-dimmed');
      });
    }, [], 1);
  } else {
    // 모바일: IntersectionObserver 진입 애니메이션
    cards.forEach((card) => {
      gsap.from(card, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }
}

/**
 * 제품 섹션: 라이트→다크 body 배경 전환 + 민트 라인 draw-in + 앱 윈도우 stagger reveal
 */
function animateProductsSection(): void {
  const section = document.querySelector('#products');
  if (!section) return;

  // 라이트→다크 body 배경 전환 (섹션 중앙 도달 시)
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'top 20%',
    onEnter: () => {
      gsap.to('body', {
        backgroundColor: '#0a1929',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
    onLeaveBack: () => {
      gsap.to('body', {
        backgroundColor: '#fafaf9',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
  });

  // 민트 라인 draw-in (좌→우)
  gsap.set('[data-mint-line]', { scaleX: 0 });
  gsap.to('[data-mint-line]', {
    scaleX: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

  // 앱 윈도우 scale + fade in
  gsap.to('[data-window]', {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  // 창 헤더 dots stagger (stage 2: 60ms)
  gsap.from('[data-window-dot]', {
    opacity: 0,
    scale: 0.5,
    duration: 0.4,
    stagger: 0.06,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.3,
  });

  // 윈도우 내부 섹션 stagger (stage 3: 80ms)
  gsap.from('[data-window-section]', {
    opacity: 0,
    y: 8,
    duration: 0.6,
    stagger: 0.08,
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.5,
  });

  // stat-card stagger
  gsap.from('[data-window-card]', {
    opacity: 0,
    y: 6,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.7,
  });

  // list row stagger
  gsap.from('[data-window-row]', {
    opacity: 0,
    x: -4,
    duration: 0.4,
    stagger: 0.08,
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    delay: 1.0,
  });

  // 태그 칩 pop-in
  gsap.from('[data-tag]', {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    stagger: 0.06,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.5,
  });

  // ProductCard 정보 영역 reveal 요소들
  gsap.from('[data-reveal]', {
    opacity: 0,
    y: 16,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.product-card',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });
}

/**
 * 문의 섹션: 다크→라이트 배경 복귀 + 카드 진입
 */
function animateContact(): void {
  const section = document.querySelector('#contact');
  if (!section) return;

  // 다크→라이트 body 배경 복귀
  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'top 30%',
    onEnter: () => {
      gsap.to('body', {
        backgroundColor: '#fafaf9',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
    onLeaveBack: () => {
      gsap.to('body', {
        backgroundColor: '#0a1929',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
  });

  // 카드 진입
  gsap.from('#contact .card', {
    y: 32,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '#contact .contact-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/scripts/scroll-animations.ts
git commit -m "feat: GSAP 스크롤 애니메이션 (전역 defaults, Hero, Capabilities pin, Products 클라이맥스, Contact)"
```

---

## Task 20: hexagon-interactive 스크립트

**Files:**
- Create: `src/scripts/hexagon-interactive.ts`

- [ ] **Step 1: `src/scripts/hexagon-interactive.ts` 생성**

```typescript
import { prefersReducedMotion, hasHover } from './motion-guards';

/**
 * Hero 헥사곤 마우스 패럴럭스 (lerp 보간).
 * 데스크톱 + hover 디바이스 only. reduced-motion 시 비활성.
 */
export function initHexagonInteractive(): void {
  if (prefersReducedMotion() || !hasHover()) return;

  const hexagon = document.querySelector<HTMLElement>('.hero-hexagon');
  if (!hexagon) return;

  const svg = hexagon.querySelector<SVGElement>('svg');
  if (!svg) return;

  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  const maxRotY = 8;
  const maxRotX = 5;
  const lerpFactor = 0.08;

  function handleMouseMove(e: MouseEvent): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const relX = (e.clientX / vw) * 2 - 1; // -1 ~ 1
    const relY = (e.clientY / vh) * 2 - 1;
    targetRotY = relX * maxRotY;
    targetRotX = -relY * maxRotX;
  }

  function animate(): void {
    currentRotX += (targetRotX - currentRotX) * lerpFactor;
    currentRotY += (targetRotY - currentRotY) * lerpFactor;
    svg!.style.transform = `translate3d(0, 0, 0) rotateY(${currentRotY}deg) rotateX(${currentRotX}deg)`;
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  requestAnimationFrame(animate);
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/scripts/hexagon-interactive.ts
git commit -m "feat: 히어로 헥사곤 마우스 패럴럭스 (lerp 보간, 데스크톱 전용)"
```

---

## Task 21: Base 레이아웃에 스크립트 통합

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Base.astro 에 스크립트 진입점 추가**

기존 Base.astro 파일의 `</body>` 바로 앞에 아래 `<script>` 블록 추가:

```astro
    <slot />

    <script>
      import { initSmoothScroll } from '../scripts/smooth-scroll';
      import { initScrollAnimations } from '../scripts/scroll-animations';
      import { initHexagonInteractive } from '../scripts/hexagon-interactive';

      // DOM 준비 완료 후 순차 초기화
      function init() {
        initSmoothScroll();
        initScrollAnimations();
        initHexagonInteractive();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    </script>
  </body>
</html>
```

- [ ] **Step 2: 개발 서버 확인**

```bash
pnpm dev
```

확인 항목:
- Hero 로드 시 헤드라인 단어들이 순차 페이드인 (80ms stagger)
- Hero 헥사곤이 1.2초에 걸쳐 scale 1.2→1로 fade in
- 마우스 움직일 때 헥사곤이 부드럽게 기울어짐 (lerp 보간)
- 스크롤 시 Lenis 스무스 스크롤 느낌
- Capabilities 섹션 중앙 도달 시 핀되면서 카드 순차 활성화
- Products 섹션 진입 시 body 배경 다크로 전환 (1.2s)
- 민트 라인 좌→우로 그려짐
- TutorMate 앱 윈도우가 페이드인 + scale, 내부 UI stagger 등장
- 태그 칩 pop-in (back.out)
- Contact 섹션 진입 시 body 배경 라이트로 복귀
- 카드 2개 stagger 등장

- [ ] **Step 3: 크롬 개발자 도구에서 "Rendering" 탭 열기 → "Emulate CSS media feature prefers-reduced-motion" 를 `reduce`로 설정 → 새로고침 → 모든 애니메이션이 즉시 완료 상태로 표시되는지 확인**

애니메이션 없이도 페이지가 정상적으로 보여야 함 (콘텐츠가 다 보임).

- [ ] **Step 4: 커밋**

```bash
git add src/layouts/Base.astro
git commit -m "feat: Base 레이아웃에 스무스 스크롤/스크롤 애니메이션/헥사곤 인터랙션 통합"
```

---

## Task 22: 세부 반응형 & 4K 검증 (인터랙션 포함)

**Files:**
- None (검증 + 마이너 수정)

- [ ] **Step 1: 전 브레이크포인트 애니메이션 품질 확인**

```bash
pnpm dev
```

개발자 도구 반응형 모드:

| 뷰포트 | 확인 포인트 |
|---|---|
| 360px | Capabilities pin 비활성 (일반 스크롤), Hero 헥사곤 작게 세로 스택 |
| 768px | 여전히 핀 비활성, 카드 진입만 있음 |
| 1024px | Capabilities pin 활성화 시작, 카드 순차 활성화 |
| 1280px | 풀 인터랙션, 마우스 패럴럭스 동작 |
| 1536px | 섹션 패딩 확장 유지 |
| 1920px | 중앙 프레임 유지, 가장자리 여백 |
| 2560px | 콘텐츠 1440px 중앙, 빈 여백 자연스러움 |

- [ ] **Step 2: iOS Safari / Android Chrome 실기기 테스트 (가능한 경우)**

- 네이티브 스크롤 느낌
- 터치 탭 응답성
- 주소창 표시/숨김 시 레이아웃 깨짐 없음

- [ ] **Step 3: 이슈 수정 & 커밋**

발견된 이슈가 있으면 수정 후:

```bash
git add -u
git commit -m "fix: 반응형/인터랙션 이슈 수정 (4K 및 실기기 검증 후)"
```

---

## Task 23: 접근성 패스

**Files:**
- Modify: 필요 시 컴포넌트들
- Create: `scripts/axe-check.js`

- [ ] **Step 1: `scripts/axe-check.js` 생성 (간이 접근성 검사)**

```javascript
// 브라우저 콘솔에서 실행하는 axe-core 간이 검사
// 사용법: pnpm dev → 브라우저 콘솔에 붙여넣기
import('https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js').then(() => {
  axe.run().then((results) => {
    console.log('== axe-core 접근성 검사 결과 ==');
    console.log('Violations:', results.violations.length);
    results.violations.forEach((v) => {
      console.log(`[${v.impact}] ${v.id}: ${v.description}`);
      v.nodes.forEach((n) => console.log('  →', n.target.join(' ')));
    });
  });
});
```

- [ ] **Step 2: 키보드 네비게이션 검증**

```bash
pnpm dev
```

1. 페이지 로드 → Tab 키 반복 → 논리적 순서로 이동하는지:
   - 스킵 링크 (포커스 시 나타남)
   - Nav 로고 → 역량 → 제품 → 문의 링크
   - Hero Primary CTA → Secondary CTA
   - Contact 이메일 카드 → 폼 필드들 → 제출 버튼
2. 모든 포커스 가능한 요소에 가시적 포커스 링이 뜨는지 (global.css `:focus-visible` 정의)
3. Enter/Space로 버튼/링크 활성화

- [ ] **Step 3: axe-core 실행 및 violations 0 달성**

개발자 도구 콘솔에서 위 `axe-check.js` 내용 복사 실행. violations 발견되면 해당 요소 수정:

- 이미지/아이콘 `alt` 누락 → 의미 있으면 `alt`, 데코레이션이면 `aria-hidden="true"`
- 폼 라벨 누락 → `<label for="">` 확인
- 명도비 부족 → tokens.css 컬러 조정
- 제목 계층 건너뜀 → h1 → h2 → h3 순서 확인

- [ ] **Step 4: 명도비 수동 검증**

Chrome 개발자 도구 → Elements → Styles → 텍스트 색상 박스 클릭 → Contrast ratio 표시. 모든 텍스트가 AA (4.5:1) 이상인지.

- [ ] **Step 5: 커밋**

```bash
git add -u scripts/
git commit -m "chore: 접근성 패스 (axe-core 검증 + 키보드/포커스/명도비 수정)"
```

---

## Task 24: 성능 패스

**Files:**
- Modify: 필요 시 스크립트/컴포넌트
- Modify: `astro.config.mjs` (sitemap 등)

- [ ] **Step 1: 프로덕션 빌드**

```bash
pnpm build
```

Expected: 빌드 성공. `dist/` 디렉토리 생성.

- [ ] **Step 2: 빌드 산출물 사이즈 확인**

```bash
du -sh dist/
ls -lh dist/_astro/
```

Expected: 초기 JS 번들 각 파일 100KB 이하, CSS 50KB 이하 (gzip 전).

- [ ] **Step 3: 프로덕션 미리보기**

```bash
pnpm preview
```

`http://localhost:4321` 방문.

- [ ] **Step 4: Lighthouse 감사**

Chrome 개발자 도구 → Lighthouse 탭 → Mobile + Desktop 각각 실행.

목표:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

- [ ] **Step 5: 이슈 수정**

흔한 이슈:
- **LCP 느림** → Hero 헥사곤 SVG 인라인 최적화 or 배경 이미지 preload
- **Unused CSS** → Tailwind v4는 자동 제거 (pnpm build에서 확인)
- **GSAP 번들 크기** → `dynamic import` 로 lazy load
- **이미지 최적화** → Astro `<Image>` 컴포넌트 사용 (있을 경우)

**GSAP lazy load 최적화 (필요 시):**

`src/layouts/Base.astro` 의 스크립트 블록을 다음과 같이 변경 — 뷰포트에 hero가 진입한 후에만 스크롤 애니메이션 초기화:

```astro
<script>
  async function init() {
    const { initSmoothScroll } = await import('../scripts/smooth-scroll');
    const { initScrollAnimations } = await import('../scripts/scroll-animations');
    const { initHexagonInteractive } = await import('../scripts/hexagon-interactive');

    initSmoothScroll();
    initScrollAnimations();
    initHexagonInteractive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
</script>
```

- [ ] **Step 6: 재감사 후 목표 달성**

Lighthouse 재실행 → 모든 카테고리 90+ 달성.

- [ ] **Step 7: 커밋**

```bash
git add -u
git commit -m "perf: Lighthouse 90+ 달성 (GSAP lazy import, 폰트 preload 최적화)"
```

---

## Task 25: Playwright 스모크 테스트

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/smoke.spec.ts`

- [ ] **Step 1: Playwright 설치 & 브라우저 다운로드**

```bash
pnpm exec playwright install --with-deps chromium
```

- [ ] **Step 2: `playwright.config.ts` 생성**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: `tests/smoke.spec.ts` 생성**

```typescript
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
```

- [ ] **Step 4: 테스트 실행**

```bash
pnpm exec playwright test
```

Expected: 7개 테스트 모두 PASS.

- [ ] **Step 5: 실패 시 디버그**

실패가 있으면:
```bash
pnpm exec playwright test --debug
```

또는 리포트 확인:
```bash
pnpm exec playwright show-report
```

- [ ] **Step 6: package.json에 test 스크립트 추가**

`package.json` 의 `scripts` 블록에 추가:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  }
}
```

- [ ] **Step 7: `.gitignore` 에 Playwright 산출물 추가**

`.gitignore` 에 추가:

```
# Playwright
test-results/
playwright-report/
blob-report/
playwright/.cache/
```

- [ ] **Step 8: 커밋**

```bash
git add playwright.config.ts tests/ package.json .gitignore
git commit -m "test: Playwright 스모크 테스트 (렌더링, 앵커, 폼, reduced-motion)"
```

---

## Task 26: Cloudflare Pages 배포 설정

**Files:**
- Create: `wrangler.toml`
- Create: `.env.example`

- [ ] **Step 1: `wrangler.toml` 생성**

```toml
name = "taktonlabs-web"
compatibility_date = "2026-01-01"
pages_build_output_dir = "dist"
```

- [ ] **Step 2: `.env.example` 생성**

```bash
# Web3Forms Access Key (무료 가입 후 받음: https://web3forms.com)
PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

- [ ] **Step 3: `.env` 파일 생성 (로컬 실제 키, .gitignore 확인)**

```bash
# 실제 키는 Web3Forms에서 발급받은 후 입력
echo 'PUBLIC_WEB3FORMS_ACCESS_KEY=your_real_key' > .env
```

`.gitignore` 에 이미 `.env` 있는지 확인. 없으면 추가.

- [ ] **Step 4: GitHub 레포 생성 & 푸시**

GitHub 웹에서 `taktonlabs-web` private/public 레포 생성 후:

```bash
git remote add origin git@github.com:YOUR_USERNAME/taktonlabs-web.git
git branch -M main
git push -u origin main
```

- [ ] **Step 5: Cloudflare Pages 프로젝트 생성 (수동)**

Cloudflare 대시보드에서:
1. Workers & Pages → Create Application → Pages → Connect to Git
2. GitHub 레포 `taktonlabs-web` 선택
3. 빌드 설정:
   - Framework preset: `Astro`
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Environment variables:
     - `PUBLIC_WEB3FORMS_ACCESS_KEY` = (실제 키)
     - `NODE_VERSION` = `22.12.0`
4. Save and Deploy

- [ ] **Step 6: 배포 URL에서 확인**

`https://taktonlabs-web.pages.dev` 접속 → 페이지 정상 동작 확인.

- [ ] **Step 7: 커밋**

```bash
git add wrangler.toml .env.example
git commit -m "chore: Cloudflare Pages 배포 설정 (wrangler.toml, .env.example)"
git push
```

---

## Task 27: 커스텀 도메인 & Email Routing

**Files:**
- None (Cloudflare 대시보드 작업)

- [ ] **Step 1: Cloudflare Registrar에서 `taktonlabs.com` 구매**

1. Cloudflare 대시보드 → Domain Registration → Register Domains
2. `taktonlabs.com` 검색 → 구매 (~$9/년)
3. 결제 완료 → DNS 자동 세팅

- [ ] **Step 2: Pages 프로젝트에 커스텀 도메인 연결**

1. Cloudflare Pages → `taktonlabs-web` 프로젝트 → Custom domains
2. "Set up a custom domain" → `taktonlabs.com` 입력
3. DNS 자동 설정 승인

- [ ] **Step 3: `www.taktonlabs.com` 리다이렉트 (선택)**

Pages → Custom domains → `www.taktonlabs.com` 추가 → 리다이렉트 설정.

- [ ] **Step 4: Email Routing 활성화**

1. Cloudflare 대시보드 → `taktonlabs.com` 사이트 선택
2. Email → Email Routing → Get Started
3. 목적지 주소 (개인 Gmail) 등록 & 인증
4. 라우트 추가: `hello@taktonlabs.com` → 개인 Gmail
5. Catch-all 설정 (선택): 모든 `@taktonlabs.com` → Gmail

- [ ] **Step 5: 이메일 라우팅 테스트**

외부 이메일 계정에서 `hello@taktonlabs.com` 로 테스트 메일 발송 → 개인 Gmail 수신 확인.

- [ ] **Step 6: Astro site URL 업데이트**

`astro.config.mjs` 의 `site` 가 `https://taktonlabs.com` 인지 재확인. 배포 재빌드.

- [ ] **Step 7: 최종 스모크 체크**

```
✓ https://taktonlabs.com 접속 → 랜딩페이지 정상 렌더링
✓ 문의 폼 제출 → Web3Forms 이메일 수신 (Cloudflare Email Routing 경유)
✓ Lighthouse 프로덕션 점수 90+
✓ 모바일 실기기에서 스크롤 인터랙션 부드러움
✓ 다크 블록 전환 드라마틱
```

- [ ] **Step 8: 최종 커밋 (마이너 조정이 있으면)**

```bash
git add -u
git commit -m "chore: 프로덕션 배포 (taktonlabs.com + Email Routing)"
git push
```

---

## 구현 완료 체크리스트

### 기능
- [ ] Hero 헤드라인 단어 stagger 등장
- [ ] Hero 헥사곤 3D 마우스 패럴럭스 (데스크톱)
- [ ] Capabilities pin 섹션 + 카드 순차 활성화 (데스크톱)
- [ ] Products 라이트→다크 body 배경 전환
- [ ] Products 민트 라인 draw-in
- [ ] Products TutorMate 앱 윈도우 stagger reveal
- [ ] Contact 다크→라이트 배경 복귀
- [ ] Contact 폼 Web3Forms 제출 + 성공 애니메이션

### 디자인 철학 (모든 축 검증)
- [ ] **고급:** 오프화이트 `#fafaf9`, 노이즈, 라디우스 4단계만, 간격 8px 그리드, 이모지 없음
- [ ] **부드러움:** 통합 이징 토큰, GSAP defaults 0.8s, Lenis 튜닝, 모든 transform `translate3d`, reduced-motion 폴백
- [ ] **신뢰:** 포커스 소프트 링, Nav 그라디언트 라인, 다크 블록 민트 라인, 법인 placeholder

### 반응형
- [ ] 360px / 640 / 768 / 1024 / 1280 / 1536 / 1920 / 2560px 모든 검증
- [ ] 모바일 pin 비활성 + IntersectionObserver 진입
- [ ] 4K 중앙 프레임 1440px max-width

### 성능 & 접근성
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 95+
- [ ] Lighthouse SEO 95+
- [ ] 키보드 네비게이션 완전
- [ ] 스킵 링크 동작
- [ ] axe-core violations 0

### 배포
- [ ] Cloudflare Pages 프로덕션 배포
- [ ] `taktonlabs.com` 커스텀 도메인
- [ ] Email Routing `hello@taktonlabs.com` → Gmail
- [ ] Playwright 스모크 7/7 PASS
