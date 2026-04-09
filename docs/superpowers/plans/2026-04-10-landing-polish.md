# Taktonlabs 랜딩 v2 리디자인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 스펙 `docs/superpowers/specs/2026-04-10-landing-polish-design.md` 기준으로 랜딩페이지에 4개 신규 섹션(Philosophy / Process / Why / FAQ)을 추가하고, 기존 4개 섹션의 카피를 보강하며, Latin 폰트를 Inter → Geist 로 교체하고, SEO schema 3개를 추가한다.

**Architecture:** 기존 Astro 6 + Tailwind v4 구조 유지. 신규 섹션은 각각 2개의 컴포넌트(Section wrapper + Card/Item)로 분해하고 콘텐츠는 `src/data/*.ts` 에 타입 세이프하게 분리. 인터랙션은 기존 `scroll-animations.ts` 에 함수 추가. FAQ 아코디언만 별도 스크립트로 분리.

**Tech Stack:** Astro 6, Tailwind v4, GSAP ScrollTrigger (기존), Lenis (기존), Geist Variable (신규), astro-icon + Lucide (기존), Pretendard Variable (기존), Playwright + WebKit (기존)

**Reference:** 스펙 전체는 `docs/superpowers/specs/2026-04-10-landing-polish-design.md` 참조. 이 플랜은 "어떻게 구현할지"에 집중.

---

## 파일 구조 (신규 + 수정)

### 신규 파일
```
public/fonts/
├── GeistVariable.woff2              # Geist variable font (신규)

src/data/
├── philosophy.ts                    # 3 brand values (신뢰성/명확성/지속성)
├── process.ts                       # 4-step process (이해/설계/개발/운영)
├── why.ts                           # 4 promises (Why Takton Labs)
└── faq.ts                           # 6 FAQ Q&A

src/components/
├── Philosophy.astro                 # Section 02 wrapper
├── PhilosophyCard.astro             # Individual value card
├── Process.astro                    # Section 04 wrapper (sticky layout)
├── ProcessStep.astro                # Individual step card
├── WhyTakton.astro                  # Section 05 wrapper
├── WhyCard.astro                    # Individual promise card
├── Faq.astro                        # Section 07 wrapper (JSON-LD 포함)
└── FaqItem.astro                    # Individual Q&A accordion item

src/scripts/
└── faq.ts                           # Accordion click handler + keyboard a11y
```

### 수정 파일
```
public/fonts/InterVariable.woff2     # 삭제

src/styles/
├── tokens.css                       # 폰트 스택 업데이트
└── global.css                       # @font-face 교체

src/layouts/
└── Base.astro                       # Geist preload + 새 JSON-LD schemas

src/components/
├── Hero.astro                       # 서브카피 1→3문장 확장
├── Capabilities.astro                # 서브카피 추가, CapabilityCard 에 techStack 전달
├── CapabilityCard.astro             # techStack prop 추가
├── Products.astro                    # 헤드라인 카피 수정
└── Contact.astro                    # 서브카피 확장

src/pages/
└── index.astro                      # 신규 4개 섹션 import + 배치

src/scripts/
└── scroll-animations.ts             # animatePhilosophy/Process/Why 함수 추가

tests/
└── smoke.spec.ts                    # 7 신규 테스트 케이스
```

### 최종 페이지 구조 (8 섹션)
```
<Nav />
<main id="main">
  <Hero />                    # 01 기존, 카피 확장
  <Philosophy />              # 02 신규
  <Capabilities />            # 03 기존, 카피 확장
  <Process />                 # 04 신규
  <WhyTakton />               # 05 신규
  <Products />                # 06 기존, 카피 미세 조정
  <Faq />                     # 07 신규
  <Contact />                 # 08 기존, 카피 확장
</main>
<Footer />
```

---

## Task 1: Geist 폰트 자가 호스트 + 기존 Inter 제거

**Files:**
- Create: `public/fonts/GeistVariable.woff2`
- Delete: `public/fonts/InterVariable.woff2`
- Modify: `src/styles/global.css`
- Modify: `src/styles/tokens.css`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Geist Variable 폰트 다운로드**

```bash
cd /Users/kjh/dev/taktonlabs-web/public/fonts
curl -L -o GeistVariable.woff2 \
  "https://cdn.jsdelivr.net/fontsource/fonts/geist:vf@latest/latin-wght-normal.woff2"
ls -la GeistVariable.woff2
```

Expected: 파일 크기 약 50~150KB. 200KB 이하여야 정상.

만약 fontsource CDN 이 실패하면 대안으로:
```bash
curl -L -o GeistVariable.woff2 \
  "https://fonts.gstatic.com/s/geist/v1/gyByhwUxId8gMEwYGFcv.woff2"
```

- [ ] **Step 2: 기존 Inter 폰트 삭제**

```bash
cd /Users/kjh/dev/taktonlabs-web/public/fonts
rm InterVariable.woff2
ls
```

Expected: `GeistVariable.woff2` + `PretendardVariable.woff2` 만 남음.

- [ ] **Step 3: `src/styles/global.css` 의 `@font-face` 교체**

기존의 Inter `@font-face` 를 Geist 로 교체:

```css
/* 파일 상단에 추가 또는 기존 Inter 블록 교체 */
@font-face {
  font-family: 'Geist';
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/GeistVariable.woff2') format('woff2-variations');
}
```

`Inter Variable` 로 시작하는 `@font-face` 블록 전체 삭제.

- [ ] **Step 4: `src/styles/tokens.css` 의 font-sans 업데이트**

기존:
```css
--font-sans: 'Pretendard Variable', Pretendard, 'Inter Variable', Inter,
  -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

변경:
```css
--font-sans: 'Pretendard Variable', Pretendard, 'Geist', 'Geist Variable',
  -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-display-latin: 'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

`--font-display-latin` 을 새로 추가 (라틴 전용 디스플레이 용도).

- [ ] **Step 5: `src/layouts/Base.astro` 의 폰트 preload 교체**

기존:
```astro
<link
  rel="preload"
  href="/fonts/InterVariable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

변경:
```astro
<link
  rel="preload"
  href="/fonts/GeistVariable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

- [ ] **Step 6: `src/styles/global.css` body font-feature-settings 업데이트**

기존:
```css
body {
  ...
  font-feature-settings: 'ss01', 'cv11', 'tnum';
  ...
}
```

변경 (Geist 가 지원하는 OpenType features):
```css
body {
  ...
  font-feature-settings: 'ss01', 'ss02', 'cv11', 'tnum', 'zero';
  ...
}
```

- [ ] **Step 7: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

Expected: "Complete!" 에러 없음.

- [ ] **Step 8: 로컬 dev 서버로 폰트 시각 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm dev 2>&1 &
sleep 3
```

브라우저에서 `http://localhost:4321` 열고 개발자 도구 Network 탭에서:
- `GeistVariable.woff2` 가 로드되는지
- `InterVariable.woff2` 는 더 이상 요청되지 않는지

Computed styles 에서 h1 (".headline") 의 font-family 에 `Geist` 가 포함되는지 확인.

- [ ] **Step 9: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add public/fonts/GeistVariable.woff2 public/fonts/InterVariable.woff2 \
        src/styles/global.css src/styles/tokens.css src/layouts/Base.astro
git commit -m "feat: Latin 폰트 Inter → Geist 교체 (Vercel, SF Pro 영감)"
```

---

## Task 2: 데이터 파일 4개 생성

**Files:**
- Create: `src/data/philosophy.ts`
- Create: `src/data/process.ts`
- Create: `src/data/why.ts`
- Create: `src/data/faq.ts`

- [ ] **Step 1: `src/data/philosophy.ts` 생성**

```typescript
/**
 * Taktonlabs 의 3 가지 브랜드 약속 (신뢰성 · 명확성 · 지속성).
 * 브랜드 가이드 문서에서 추출. Philosophy 섹션에서 사용.
 */

export interface PhilosophyValue {
  /** 01, 02, 03 */
  index: string;
  /** 영문 라벨 (Geist 로 렌더링) */
  labelLatin: string;
  /** 한글 라벨 */
  labelKo: string;
  /** 키워드 제목 */
  title: string;
  /** 본문 카피 (2~3 문장) */
  body: string;
  /** 본문에서 하이라이트할 핵심 단어 */
  highlight: string;
}

export const philosophyValues: PhilosophyValue[] = [
  {
    index: '01',
    labelLatin: 'RELIABILITY',
    labelKo: '신뢰성',
    title: '튼튼한 장부처럼',
    body: '한 명의 회원도, 한 건의 수납도 놓치지 않습니다. 데이터는 안전하게 보관되고, 언제든 정확히 복원됩니다. 편리함을 위해 신뢰를 타협하지 않습니다.',
    highlight: '장부처럼',
  },
  {
    index: '02',
    labelLatin: 'CLARITY',
    labelKo: '명확성',
    title: '한눈에 보이는 지표',
    body: '누가 미납했는지, 이번 달 매출은 얼마인지. 복잡한 숫자를 단순한 대시보드로. 판단에 필요한 정보만, 필요한 순간에 드러납니다.',
    highlight: '한눈에',
  },
  {
    index: '03',
    labelLatin: 'SUSTAINABILITY',
    labelKo: '지속성',
    title: '함께 성장하는 파트너',
    body: '일시적인 도구가 아닙니다. 비즈니스가 자라면 소프트웨어도 함께 자라야 합니다. 긴 호흡으로 파트너가 되는 것이 목표입니다.',
    highlight: '파트너',
  },
];
```

- [ ] **Step 2: `src/data/process.ts` 생성**

```typescript
/**
 * Taktonlabs 프로젝트 진행 4 단계 (이해 → 설계 → 개발 → 운영).
 * Process 섹션에서 사용.
 */

export interface ProcessStep {
  /** 01, 02, 03, 04 */
  index: string;
  /** 영문 라벨 */
  labelLatin: string;
  /** 한글 라벨 */
  labelKo: string;
  /** 부제 */
  subtitle: string;
  /** 본문 카피 */
  body: string;
  /** 원칙 3개 (작은 bullet) */
  principles: string[];
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    labelLatin: 'DISCOVER',
    labelKo: '이해',
    subtitle: '문제를 제대로 알기',
    body: '업무 흐름을 함께 걷고, 사용자의 실제 불편을 듣고, 숨겨진 요구사항을 발견합니다. 기술 선택은 그 다음입니다.',
    principles: [
      '기존 업무 관찰 (스크린 공유·인터뷰)',
      '진짜 고객(실사용자) 목소리 수집',
      '요구사항 정리 문서로 합의',
    ],
  },
  {
    index: '02',
    labelLatin: 'DESIGN',
    labelKo: '설계',
    subtitle: '구조가 결과를 결정한다',
    body: '화면보다 먼저 데이터 모델과 API 경계를 잡습니다. 탄탄한 설계가 유지보수 10년의 비용을 결정합니다.',
    principles: [
      '데이터 모델 먼저, UI는 그 다음',
      '확장 포인트 미리 설계',
      '실제 사용자와 UI 프로토타입 검증',
    ],
  },
  {
    index: '03',
    labelLatin: 'BUILD',
    labelKo: '개발',
    subtitle: '한 번에 올바르게',
    body: '검증된 기술과 모범 사례로 느리지만 확실하게 만듭니다. 테스트 없는 코드는 출시하지 않습니다.',
    principles: [
      '매일 빌드 가능한 상태 유지',
      '테스트 커버리지 80% 이상',
      '주 1회 데모 · 고객 피드백 반영',
    ],
  },
  {
    index: '04',
    labelLatin: 'OPERATE',
    labelKo: '운영',
    subtitle: '출시는 시작입니다',
    body: '자동 업데이트, 모니터링, 빠른 대응. 문제가 생기기 전에 발견하고, 생겼을 땐 즉시 고칩니다.',
    principles: [
      '자동 에러 수집 (Sentry·로그)',
      '정기 백업 + 복구 테스트',
      '긴급 대응 1 영업일 이내',
    ],
  },
];
```

- [ ] **Step 3: `src/data/why.ts` 생성**

```typescript
/**
 * Taktonlabs 의 4 가지 약속 (외주 공포 해소).
 * Why Takton Labs 섹션에서 사용.
 */

export interface WhyPromise {
  index: string;
  /** Lucide 아이콘 이름 */
  iconName: string;
  title: string;
  body: string;
}

export const whyPromises: WhyPromise[] = [
  {
    index: '01',
    iconName: 'lucide:infinity',
    title: '만든 사람이 끝까지 함께합니다',
    body: '기획한 사람, 설계한 사람, 코드를 짠 사람이 출시 후에도 같은 자리에 있습니다. 인수인계로 생기는 공백이 없습니다. 연락이 끊기는 일도 없습니다.',
  },
  {
    index: '02',
    iconName: 'lucide:unlock',
    title: '데이터는 완전히 당신의 것',
    body: 'Excel, CSV, SQL 덤프. 언제든 원하는 형식으로 내보낼 수 있습니다. 특정 플랫폼에 잠기지 않도록 설계부터 신경 씁니다.',
  },
  {
    index: '03',
    iconName: 'lucide:receipt',
    title: '숨겨진 비용 없는 유지보수',
    body: '월 정액 유지보수 옵션. 작은 수정도, 긴급 장애 대응도 추가 비용 없이. 큰 기능 추가만 별도 견적입니다.',
  },
  {
    index: '04',
    iconName: 'lucide:package',
    title: '소스코드 완전 양도',
    body: 'GitHub 프라이빗 레포 전체를 이관해드립니다. 다른 개발사에 맡기고 싶을 때, 내부 개발팀이 생겼을 때, 자유롭게 선택할 수 있습니다.',
  },
];
```

- [ ] **Step 4: `src/data/faq.ts` 생성**

```typescript
/**
 * 자주 묻는 질문 6개.
 * FAQ 섹션 + JSON-LD FAQPage schema 에서 사용.
 */

export interface FaqItem {
  question: string;
  /** 순수 텍스트 답변 (HTML 태그 없이) */
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: '프로젝트 비용은 어떻게 정해지나요?',
    answer: '기능 범위와 일정을 먼저 정리한 뒤 고정가 또는 기간 기반 견적을 드립니다. 소규모 랜딩은 수백만원부터, 중규모 SaaS는 수천만원 수준입니다. 첫 상담과 견적은 무료입니다.',
  },
  {
    question: '작업 기간은 보통 얼마나 걸리나요?',
    answer: '랜딩·간단한 웹은 2~4주, 중규모 웹앱은 6~10주, 데스크톱 앱이나 복잡한 SaaS는 12~20주가 기준입니다. 시간에 쫓기는 프로젝트는 사전에 공유해주시면 우선 배치합니다.',
  },
  {
    question: '출시 후 유지보수는 어떻게 되나요?',
    answer: '출시 후 1개월 기본 보증(버그 무료 수정)을 드립니다. 이후에는 월 정액 유지보수 계약을 선택하실 수 있습니다. 긴급 장애는 영업일 24시간 이내 대응합니다. TutorMate 를 예로 들면, 출시 이후 매주 1~2회 업데이트를 배포하고 있습니다.',
  },
  {
    question: '기존 시스템이 있으면 마이그레이션 가능한가요?',
    answer: '네. 기존 데이터 구조 분석 → 병렬 운영 (새 시스템과 기존 시스템 동시 가동) → 검증 후 전환 순서로 안전하게 진행합니다. 데이터 손실 없이 이전합니다. TutorMate 의 경우, 강사님들이 엑셀로 관리하던 수강생·결제 데이터를 그대로 이전해 쓰실 수 있게 설계했습니다.',
  },
  {
    question: '원격으로만 진행되나요?',
    answer: '기본은 원격(온라인 미팅·공유 문서·채팅)이지만, 양산·부산·경남 지역은 대면 미팅도 가능합니다. 수도권이나 먼 지역은 프로젝트 규모에 따라 출장이 가능합니다.',
  },
  {
    question: '소스코드는 누가 소유하나요?',
    answer: '100% 고객사 소유입니다. 프로젝트가 종료되면 GitHub 프라이빗 레포의 소유권을 전체 이관해드립니다. 이후에는 다른 개발사에 맡기거나 내부 팀에서 유지보수하실 수 있습니다.',
  },
];
```

- [ ] **Step 5: 빌드 검증 (TypeScript 오류 확인)**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

Expected: "Complete!" — 데이터 파일만 생성한 상태라서 오류 없음.

- [ ] **Step 6: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/data/philosophy.ts src/data/process.ts src/data/why.ts src/data/faq.ts
git commit -m "feat: 랜딩 v2 데이터 파일 추가 (philosophy/process/why/faq)"
```

---

## Task 3: Philosophy 섹션 컴포넌트

**Files:**
- Create: `src/components/PhilosophyCard.astro`
- Create: `src/components/Philosophy.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/components/PhilosophyCard.astro` 생성**

```astro
---
import type { PhilosophyValue } from '../data/philosophy';

interface Props {
  value: PhilosophyValue;
}

const { value } = Astro.props;

// 본문에서 highlight 단어를 <span class="highlight">로 감싸기
function splitWithHighlight(body: string, highlight: string): {
  before: string;
  highlight: string;
  after: string;
} | null {
  const idx = body.indexOf(highlight);
  if (idx === -1) return null;
  return {
    before: body.slice(0, idx),
    highlight,
    after: body.slice(idx + highlight.length),
  };
}

const parts = splitWithHighlight(value.body, value.highlight);
---

<article class="philosophy-card" data-philosophy-card>
  <div class="card-label">
    <span class="label-index">{value.index}</span>
    <span class="label-latin">{value.labelLatin}</span>
    <span class="label-sep">·</span>
    <span class="label-ko">{value.labelKo}</span>
  </div>
  <h3 class="card-title">{value.title}</h3>
  <p class="card-body">
    {
      parts ? (
        <>
          {parts.before}
          <span class="highlight" data-philosophy-highlight>
            {parts.highlight}
            <span class="underline"></span>
          </span>
          {parts.after}
        </>
      ) : (
        value.body
      )
    }
  </p>
</article>

<style>
  .philosophy-card {
    position: relative;
    padding: 28px 28px 28px 32px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-soft);
    border-left: 3px solid var(--color-accent);
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
    transition:
      border-color 0.4s var(--ease-in-out),
      box-shadow 0.6s var(--ease-smooth),
      transform 0.6s var(--ease-smooth);
  }

  .philosophy-card:hover {
    box-shadow: 0 12px 28px rgba(10, 25, 41, 0.08);
  }

  .card-label {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-family: var(--font-display-latin);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
    margin-bottom: 12px;
  }

  .label-index {
    color: var(--color-text-tertiary);
    font-variant-numeric: tabular-nums;
  }

  .label-latin {
    font-weight: 700;
  }

  .label-sep {
    color: var(--color-text-tertiary);
  }

  .label-ko {
    font-family: var(--font-sans);
    color: var(--color-accent);
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .card-title {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.25;
  }

  .card-body {
    font-size: 14px;
    line-height: 1.75;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .highlight {
    position: relative;
    color: var(--color-text);
    font-weight: 600;
    white-space: nowrap;
  }

  .highlight .underline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: var(--color-accent);
    transform-origin: left center;
    transform: scaleX(0);
    will-change: transform;
  }

  @media (min-width: 1536px) {
    .philosophy-card {
      padding: 36px 36px 36px 40px;
    }

    .card-title {
      font-size: 22px;
    }

    .card-body {
      font-size: 15px;
    }
  }
</style>
```

- [ ] **Step 2: `src/components/Philosophy.astro` 생성**

```astro
---
import PhilosophyCard from './PhilosophyCard.astro';
import { philosophyValues } from '../data/philosophy';
---

<section id="philosophy" class="philosophy" aria-labelledby="philosophy-title">
  <div class="philosophy-inner">
    <div class="philosophy-header">
      <p class="label">Philosophy · 세 가지 약속</p>
      <h2 id="philosophy-title" class="title">빈틈없는 관리의 완성</h2>
      <p class="subcopy">우리가 일하는 이유이자 기준입니다.</p>
    </div>
    <div class="card-grid">
      {philosophyValues.map((value) => <PhilosophyCard value={value} />)}
    </div>
  </div>
</section>

<style>
  .philosophy {
    background: var(--color-bg);
    padding: 96px 24px;
    position: relative;
  }

  .philosophy::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(8, 145, 178, 0.2),
      transparent
    );
  }

  .philosophy-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
  }

  .philosophy-header {
    text-align: center;
    margin-bottom: 56px;
    max-width: var(--container-narrow);
    margin-left: auto;
    margin-right: auto;
  }

  .label {
    display: inline-block;
    font-family: var(--font-display-latin);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  .title {
    font-size: clamp(26px, 4.2vw, 44px);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.15;
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

  @media (max-width: 1024px) {
    .card-grid {
      grid-template-columns: 1fr 1fr;
    }

    .card-grid > :last-child {
      grid-column: span 2;
      max-width: calc(50% - 12px);
      margin: 0 auto;
    }
  }

  @media (max-width: 640px) {
    .philosophy {
      padding: 72px 20px;
    }

    .philosophy-header {
      margin-bottom: 40px;
    }

    .card-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .card-grid > :last-child {
      grid-column: auto;
      max-width: none;
    }
  }

  @media (min-width: 1536px) {
    .philosophy {
      padding: 160px 32px;
    }

    .philosophy-header {
      margin-bottom: 72px;
    }

    .card-grid {
      gap: 32px;
    }
  }
</style>
```

- [ ] **Step 3: `src/pages/index.astro` 에 Philosophy 추가**

현재 index.astro 를 열고 `<Hero />` 와 `<Capabilities />` 사이에 `<Philosophy />` 를 삽입.

기존:
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

변경:
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Philosophy from '../components/Philosophy.astro';
import Capabilities from '../components/Capabilities.astro';
import Products from '../components/Products.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<Base>
  <Nav />
  <main id="main">
    <Hero />
    <Philosophy />
    <Capabilities />
    <Products />
    <Contact />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

Expected: "Complete!"

- [ ] **Step 5: dev 서버에서 시각 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm dev 2>&1 &
```

브라우저에서 `http://localhost:4321` 열기. Hero 섹션 아래에 Philosophy 섹션이 보이는지 확인. 3카드 그리드 레이아웃, 하이라이트 단어는 아직 밑줄 없음 (애니메이션 Task 12 에서 추가 예정).

- [ ] **Step 6: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/components/Philosophy.astro src/components/PhilosophyCard.astro src/pages/index.astro
git commit -m "feat: Philosophy 섹션 추가 (세 가지 약속: 신뢰성·명확성·지속성)"
```

---

## Task 4: Capabilities 카피 + 기술 태그 보강

**Files:**
- Modify: `src/components/CapabilityCard.astro`
- Modify: `src/components/Capabilities.astro`

- [ ] **Step 1: `src/components/CapabilityCard.astro` 에 techStack prop 추가**

Props interface 와 template 을 아래처럼 수정:

```astro
---
import { Icon } from 'astro-icon/components';

interface Props {
  iconName: string;
  title: string;
  description: string;
  techStack: string[];
  index: number;
}

const { iconName, title, description, techStack, index } = Astro.props;
---

<article class="capability-card" data-card-index={index}>
  <div class="icon-wrap">
    <Icon name={iconName} width={24} height={24} />
  </div>
  <h3 class="title">{title}</h3>
  <p class="description">{description}</p>
  <p class="tech-stack">{techStack.join(' · ')}</p>
</article>
```

- [ ] **Step 2: CapabilityCard style 에 `.tech-stack` 규칙 추가**

`<style>` 블록 안에 `.description` 규칙 다음에 추가:

```css
  .tech-stack {
    font-family: var(--font-display-latin);
    font-size: 10px;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: 0.05em;
    margin: 12px 0 0;
    padding-top: 12px;
    border-top: 1px dashed var(--color-border-soft);
  }

  @media (min-width: 1536px) {
    .tech-stack {
      font-size: 11px;
    }
  }
```

- [ ] **Step 3: `src/components/Capabilities.astro` 에서 카드 데이터 확장 + 서브카피 추가**

현재 cards 배열을 찾아서 각 카드의 description 을 확장하고 techStack 추가:

```typescript
const cards = [
  {
    iconName: 'lucide:layout-grid',
    title: '웹·모바일 제품',
    description:
      'SaaS, 웹앱, 반응형 사이트. 기획부터 디자인, 개발, 배포, 그리고 사용자 피드백을 반영한 개선까지. 프로토타입에 머무르지 않는 진짜 운영 가능한 제품을 만듭니다.',
    techStack: ['React', 'Astro', 'Supabase', 'TypeScript'],
  },
  {
    iconName: 'lucide:app-window',
    title: '데스크톱 앱',
    description:
      'Electron 기반 크로스플랫폼. Windows·macOS 양쪽에 자동 업데이트, 코드 사이닝, 로컬 DB, 오프라인 동작까지. TutorMate가 현재 이 스택으로 운영 중입니다.',
    techStack: ['Electron', 'SQLite', 'Auto-Updater'],
  },
  {
    iconName: 'lucide:blocks',
    title: 'B2B 맞춤 개발',
    description:
      '업무 흐름을 걷고 관찰한 뒤 만듭니다. 엑셀로 반복하던 작업을 대시보드로, 수작업으로 하던 일을 자동화로. 기능 개수보다 실제 사용 경험을 우선합니다.',
    techStack: ['Node.js', 'PostgreSQL', 'REST', 'GraphQL'],
  },
];
```

- [ ] **Step 4: Capabilities header 에 서브카피 문장 추가**

`<p class="subcopy">하나를 만들어도 처음부터 끝까지 직접 합니다.</p>` 을 찾아 아래처럼 변경:

```astro
      <p class="subcopy">
        하나를 만들어도 처음부터 끝까지 직접 합니다.
        <br />
        우리가 선택한 기술은 모두 우리가 직접 쓰는 것들입니다. 자랑이 아니라 책임을 위해서입니다.
      </p>
```

- [ ] **Step 5: Capabilities 의 CapabilityCard 렌더링 확인**

기존:
```astro
{cards.map((card, i) => <CapabilityCard {...card} index={i} />)}
```

`techStack` 이 spread operator 로 자동 전달되므로 변경 불필요. 그대로 작동.

- [ ] **Step 6: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

- [ ] **Step 7: 시각 검증**

dev 서버에서 Capabilities 섹션 확인:
- 각 카드에 확장된 설명이 보이는지
- 카드 하단에 점선 구분선 + `React · Astro · Supabase · TypeScript` 같은 기술 태그 줄이 보이는지
- 서브카피 두 문장이 모두 보이는지

- [ ] **Step 8: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/components/CapabilityCard.astro src/components/Capabilities.astro
git commit -m "feat: Capabilities 카피 확장 + 카드별 기술 태그 추가"
```

---

## Task 5: Process 섹션 (sticky progress bar)

**Files:**
- Create: `src/components/ProcessStep.astro`
- Create: `src/components/Process.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/components/ProcessStep.astro` 생성**

```astro
---
import type { ProcessStep as ProcessStepType } from '../data/process';

interface Props {
  step: ProcessStepType;
}

const { step } = Astro.props;
---

<article class="process-step" data-process-step data-step-index={step.index}>
  <div class="step-header">
    <div class="step-label">
      <span class="step-num">{step.index}</span>
      <span class="step-latin">{step.labelLatin}</span>
      <span class="step-sep">·</span>
      <span class="step-ko">{step.labelKo}</span>
    </div>
    <h3 class="step-subtitle">{step.subtitle}</h3>
  </div>
  <p class="step-body">{step.body}</p>
  <ul class="step-principles">
    {step.principles.map((p) => <li>{p}</li>)}
  </ul>
</article>

<style>
  .process-step {
    padding: 40px 0;
    border-bottom: 1px solid var(--color-border-soft);
  }

  .process-step:last-child {
    border-bottom: none;
  }

  .step-header {
    margin-bottom: 18px;
  }

  .step-label {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-family: var(--font-display-latin);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-accent);
    margin-bottom: 14px;
  }

  .step-num {
    color: var(--color-text-tertiary);
    font-variant-numeric: tabular-nums;
  }

  .step-sep {
    color: var(--color-text-tertiary);
  }

  .step-ko {
    font-family: var(--font-sans);
    color: var(--color-accent);
    letter-spacing: 0.02em;
  }

  .step-subtitle {
    font-size: clamp(22px, 3.4vw, 32px);
    font-weight: 800;
    letter-spacing: -0.022em;
    color: var(--color-text);
    margin: 0;
    line-height: 1.2;
  }

  .step-body {
    font-size: 15px;
    line-height: 1.75;
    color: var(--color-text-secondary);
    margin: 0 0 20px;
    max-width: 560px;
  }

  .step-principles {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .step-principles li {
    position: relative;
    padding-left: 22px;
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .step-principles li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 12px;
    height: 2px;
    background: var(--color-accent);
  }

  @media (min-width: 1024px) {
    .process-step {
      padding: 56px 0;
    }
  }

  @media (min-width: 1536px) {
    .step-body {
      font-size: 16px;
    }

    .step-principles li {
      font-size: 14px;
    }
  }
</style>
```

- [ ] **Step 2: `src/components/Process.astro` 생성**

```astro
---
import ProcessStep from './ProcessStep.astro';
import { processSteps } from '../data/process';
---

<section id="process" class="process" aria-labelledby="process-title">
  <div class="process-inner">
    <div class="process-header">
      <p class="label">Process · 어떻게 일하는가</p>
      <h2 id="process-title" class="title">4 단계 · 차근차근 · 끝까지</h2>
      <p class="subcopy">
        이해 → 설계 → 개발 → 운영. 어느 단계에도 지름길은 없습니다.
      </p>
    </div>

    <div class="process-body">
      <!-- Sticky progress rail (desktop only) -->
      <aside class="process-rail" aria-hidden="true">
        <div class="rail-line"></div>
        <div class="rail-markers">
          {
            processSteps.map((step) => (
              <div class="rail-marker" data-rail-marker data-marker-index={step.index}>
                <span class="marker-num">{step.index}</span>
                <span class="marker-label">{step.labelKo}</span>
              </div>
            ))
          }
        </div>
      </aside>

      <!-- Scrollable content -->
      <div class="process-steps">
        {processSteps.map((step) => <ProcessStep step={step} />)}
      </div>
    </div>
  </div>
</section>

<style>
  .process {
    background: var(--color-bg-alt);
    padding: 96px 24px;
  }

  .process-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
  }

  .process-header {
    text-align: center;
    margin-bottom: 56px;
    max-width: var(--container-narrow);
    margin-left: auto;
    margin-right: auto;
  }

  .label {
    display: inline-block;
    font-family: var(--font-display-latin);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  .title {
    font-size: clamp(26px, 4.2vw, 44px);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.15;
  }

  .subcopy {
    font-size: clamp(15px, 1.3vw, 19px);
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* ============ Layout (desktop: sticky rail + content) ============ */
  .process-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: var(--container-grid);
    margin: 0 auto;
  }

  .process-rail {
    display: none;
  }

  @media (min-width: 1024px) {
    .process-body {
      grid-template-columns: 240px 1fr;
      gap: 64px;
    }

    .process-rail {
      display: block;
      position: sticky;
      top: 120px;
      align-self: start;
      height: fit-content;
    }

    .rail-line {
      position: absolute;
      left: 18px;
      top: 18px;
      bottom: 18px;
      width: 2px;
      background: var(--color-border-soft);
    }

    .rail-markers {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .rail-marker {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      padding-left: 0;
      transition:
        opacity 0.4s var(--ease-in-out),
        transform 0.4s var(--ease-in-out);
      opacity: 0.5;
    }

    .rail-marker[data-active='true'] {
      opacity: 1;
      transform: translate3d(2px, 0, 0);
    }

    .marker-num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-bg);
      border: 2px solid var(--color-border-solid);
      font-family: var(--font-display-latin);
      font-weight: 700;
      font-size: 14px;
      color: var(--color-text-tertiary);
      font-variant-numeric: tabular-nums;
      transition:
        background-color 0.4s var(--ease-in-out),
        border-color 0.4s var(--ease-in-out),
        color 0.4s var(--ease-in-out);
    }

    .rail-marker[data-active='true'] .marker-num {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #fff;
    }

    .marker-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-secondary);
      letter-spacing: -0.005em;
    }

    .rail-marker[data-active='true'] .marker-label {
      color: var(--color-text);
    }
  }

  @media (max-width: 640px) {
    .process {
      padding: 72px 20px;
    }

    .process-header {
      margin-bottom: 40px;
    }
  }

  @media (min-width: 1536px) {
    .process {
      padding: 160px 32px;
    }

    .process-body {
      grid-template-columns: 280px 1fr;
      gap: 96px;
    }
  }
</style>
```

- [ ] **Step 3: `src/pages/index.astro` 에 Process 통합**

`<Capabilities />` 와 `<Products />` 사이에 `<Process />` 삽입:

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Philosophy from '../components/Philosophy.astro';
import Capabilities from '../components/Capabilities.astro';
import Process from '../components/Process.astro';
import Products from '../components/Products.astro';
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
    <Products />
    <Contact />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

- [ ] **Step 5: 시각 검증**

dev 서버에서 Process 섹션 확인:
- 데스크톱에서는 좌측 sticky rail + 우측 4 steps 레이아웃 (스크롤 해도 rail 이 고정)
- 모바일에서는 rail 숨김, steps 만 세로 스택
- 아직 스크롤 활성화 하이라이트는 없음 (Task 12 에서 JS 추가)

- [ ] **Step 6: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/components/Process.astro src/components/ProcessStep.astro src/pages/index.astro
git commit -m "feat: Process 섹션 (4단계 이해→설계→개발→운영, sticky progress rail)"
```

---

## Task 6: Why Takton Labs 섹션 (4 약속 카드)

**Files:**
- Create: `src/components/WhyCard.astro`
- Create: `src/components/WhyTakton.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/components/WhyCard.astro` 생성**

```astro
---
import { Icon } from 'astro-icon/components';
import type { WhyPromise } from '../data/why';

interface Props {
  promise: WhyPromise;
}

const { promise } = Astro.props;
---

<article class="why-card" data-why-card>
  <div class="card-header">
    <div class="icon-wrap">
      <Icon name={promise.iconName} width={22} height={22} />
    </div>
    <span class="card-index">{promise.index}</span>
  </div>
  <h3 class="card-title">{promise.title}</h3>
  <p class="card-body">{promise.body}</p>
</article>

<style>
  .why-card {
    padding: 32px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-lg);
    transition:
      border-color 0.4s var(--ease-in-out),
      box-shadow 0.6s var(--ease-smooth),
      transform 0.6s var(--ease-smooth);
    will-change: transform;
  }

  @media (hover: hover) and (pointer: fine) {
    .why-card:hover {
      border-color: var(--color-accent);
      box-shadow: 0 16px 32px rgba(10, 25, 41, 0.1);
      transform: translate3d(0, -4px, 0);
    }

    .why-card:hover .icon-wrap {
      background: var(--color-accent);
      color: #fff;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(8, 145, 178, 0.08);
    color: var(--color-accent);
    border-radius: var(--radius-md);
    transition:
      background-color 0.4s var(--ease-in-out),
      color 0.4s var(--ease-in-out);
  }

  .card-index {
    font-family: var(--font-display-latin);
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-tertiary);
    letter-spacing: 0.1em;
    font-variant-numeric: tabular-nums;
  }

  .card-title {
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.3;
  }

  .card-body {
    font-size: 14px;
    line-height: 1.75;
    color: var(--color-text-secondary);
    margin: 0;
  }

  @media (min-width: 1536px) {
    .why-card {
      padding: 40px;
    }

    .card-title {
      font-size: 21px;
    }

    .card-body {
      font-size: 15px;
    }
  }
</style>
```

- [ ] **Step 2: `src/components/WhyTakton.astro` 생성**

```astro
---
import WhyCard from './WhyCard.astro';
import { whyPromises } from '../data/why';
---

<section id="why" class="why" aria-labelledby="why-title">
  <div class="why-inner">
    <div class="why-header">
      <p class="label">Why Takton Labs · 왜 우리인가</p>
      <h2 id="why-title" class="title">네 가지 약속</h2>
      <p class="subcopy">외주가 무서웠던 분들을 위한 준비된 답변입니다.</p>
    </div>
    <div class="card-grid">
      {whyPromises.map((promise) => <WhyCard promise={promise} />)}
    </div>
  </div>
</section>

<style>
  .why {
    background: var(--color-bg);
    padding: 96px 24px;
  }

  .why-inner {
    max-width: var(--container-wide);
    margin: 0 auto;
  }

  .why-header {
    text-align: center;
    margin-bottom: 56px;
    max-width: var(--container-narrow);
    margin-left: auto;
    margin-right: auto;
  }

  .label {
    display: inline-block;
    font-family: var(--font-display-latin);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  .title {
    font-size: clamp(26px, 4.2vw, 44px);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.15;
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
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 640px) {
    .why {
      padding: 72px 20px;
    }

    .why-header {
      margin-bottom: 40px;
    }

    .card-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  @media (min-width: 1536px) {
    .why {
      padding: 160px 32px;
    }

    .card-grid {
      gap: 32px;
    }
  }
</style>
```

- [ ] **Step 3: `src/pages/index.astro` 에 WhyTakton 통합**

`<Process />` 와 `<Products />` 사이에 `<WhyTakton />` 삽입:

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
    <Contact />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: 빌드 + 시각 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

dev 서버에서 Process 이후 Why 섹션 표시 확인. 데스크톱에서 2×2 그리드, 모바일에서 세로 스택.

- [ ] **Step 5: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/components/WhyTakton.astro src/components/WhyCard.astro src/pages/index.astro
git commit -m "feat: Why Takton Labs 섹션 (외주 공포 해소 4가지 약속)"
```

---

## Task 7: Products 헤드라인 카피 수정

**Files:**
- Modify: `src/components/Products.astro`

- [ ] **Step 1: `src/components/Products.astro` 에서 헤드라인 한 줄 교체**

```astro
<h2 class="title">이론이 아닙니다. 실제로 만들고 운영합니다.</h2>
```

를 아래로 변경:

```astro
<h2 class="title">이론이 아닙니다. 우리가 직접 쓰고, 매주 업데이트합니다.</h2>
```

- [ ] **Step 2: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -5
```

- [ ] **Step 3: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/components/Products.astro
git commit -m "copy: Products 헤드라인 '직접 쓰고 매주 업데이트' 로 수정"
```

---

## Task 8: FAQ 섹션 (아코디언 + JSON-LD)

**Files:**
- Create: `src/components/FaqItem.astro`
- Create: `src/components/Faq.astro`
- Create: `src/scripts/faq.ts`
- Modify: `src/layouts/Base.astro` (script 등록)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: `src/components/FaqItem.astro` 생성**

```astro
---
import { Icon } from 'astro-icon/components';
import type { FaqItem as FaqItemType } from '../data/faq';

interface Props {
  item: FaqItemType;
  index: number;
}

const { item, index } = Astro.props;
const answerId = `faq-answer-${index}`;
---

<li class="faq-item" data-faq-item>
  <button
    type="button"
    class="faq-trigger"
    data-faq-trigger
    aria-expanded="false"
    aria-controls={answerId}
  >
    <span class="faq-question">{item.question}</span>
    <span class="faq-chevron" aria-hidden="true">
      <Icon name="lucide:chevron-down" width={20} height={20} />
    </span>
  </button>
  <div class="faq-answer" id={answerId} data-faq-answer role="region">
    <p>{item.answer}</p>
  </div>
</li>

<style>
  .faq-item {
    border-bottom: 1px solid var(--color-border-soft);
  }

  .faq-item:first-child {
    border-top: 1px solid var(--color-border-soft);
  }

  .faq-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 24px 0;
    background: transparent;
    border: none;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    color: var(--color-text);
    transition: color 0.3s var(--ease-in-out);
  }

  .faq-trigger:hover {
    color: var(--color-accent);
  }

  .faq-question {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.5;
  }

  .faq-chevron {
    flex-shrink: 0;
    display: inline-flex;
    color: var(--color-text-tertiary);
    transition: transform 0.4s var(--ease-in-out), color 0.3s var(--ease-in-out);
  }

  .faq-item[data-open='true'] .faq-chevron {
    transform: rotate(180deg);
    color: var(--color-accent);
  }

  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s var(--ease-in-out);
  }

  .faq-answer p {
    margin: 0 0 24px;
    padding-right: 44px;
    font-size: 14px;
    line-height: 1.75;
    color: var(--color-text-secondary);
  }

  @media (min-width: 1536px) {
    .faq-question {
      font-size: 18px;
    }

    .faq-answer p {
      font-size: 15px;
    }
  }
</style>
```

- [ ] **Step 2: `src/components/Faq.astro` 생성**

```astro
---
import FaqItem from './FaqItem.astro';
import { faqItems } from '../data/faq';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};
---

<section id="faq" class="faq" aria-labelledby="faq-title">
  <div class="faq-inner">
    <div class="faq-header">
      <p class="label">FAQ · 자주 묻는 질문</p>
      <h2 id="faq-title" class="title">궁금한 건 미리 알려드립니다</h2>
      <p class="subcopy">
        연락하기 전에 확인해보세요. 대부분의 질문은 여기서 답을 얻을 수 있습니다.
      </p>
    </div>
    <ul class="faq-list">
      {faqItems.map((item, i) => <FaqItem item={item} index={i} />)}
    </ul>
  </div>
</section>

<script type="application/ld+json" set:html={JSON.stringify(faqJsonLd)} />

<style>
  .faq {
    background: var(--color-bg-alt);
    padding: 96px 24px;
  }

  .faq-inner {
    max-width: 800px;
    margin: 0 auto;
  }

  .faq-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .label {
    display: inline-block;
    font-family: var(--font-display-latin);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 12px;
  }

  .title {
    font-size: clamp(26px, 4.2vw, 44px);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--color-text);
    margin: 0 0 12px;
    line-height: 1.15;
  }

  .subcopy {
    font-size: clamp(15px, 1.3vw, 19px);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .faq-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  @media (max-width: 640px) {
    .faq {
      padding: 72px 20px;
    }

    .faq-header {
      margin-bottom: 32px;
    }
  }

  @media (min-width: 1536px) {
    .faq {
      padding: 160px 32px;
    }
  }
</style>
```

- [ ] **Step 3: `src/scripts/faq.ts` 생성**

```typescript
/**
 * FAQ 아코디언 클릭 핸들러.
 * - 클릭 또는 Enter/Space 키로 토글
 * - aria-expanded / data-open 상태 동기화
 * - max-height 애니메이션 (scrollHeight 기반)
 */

export function initFaq(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-faq-item]');

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-faq-trigger]');
    const answer = item.querySelector<HTMLElement>('[data-faq-answer]');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      if (isOpen) {
        closeItem(item, trigger, answer);
      } else {
        openItem(item, trigger, answer);
      }
    });
  });
}

function openItem(
  item: HTMLElement,
  trigger: HTMLButtonElement,
  answer: HTMLElement
): void {
  item.setAttribute('data-open', 'true');
  trigger.setAttribute('aria-expanded', 'true');
  answer.style.maxHeight = answer.scrollHeight + 'px';
}

function closeItem(
  item: HTMLElement,
  trigger: HTMLButtonElement,
  answer: HTMLElement
): void {
  item.removeAttribute('data-open');
  trigger.setAttribute('aria-expanded', 'false');
  answer.style.maxHeight = '0';
}
```

- [ ] **Step 4: `src/layouts/Base.astro` 에서 faq.ts 등록**

기존 `<script>` 블록에 `initFaq` 임포트 + 호출 추가:

```astro
    <script>
      import { initSmoothScroll } from '../scripts/smooth-scroll';
      import { initScrollAnimations } from '../scripts/scroll-animations';
      import { initFaq } from '../scripts/faq';

      // DOM 준비 완료 후 순차 초기화
      function init() {
        initSmoothScroll();
        initScrollAnimations();
        initFaq();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    </script>
```

- [ ] **Step 5: `src/pages/index.astro` 에 Faq 통합**

`<Products />` 와 `<Contact />` 사이에 `<Faq />` 삽입:

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

- [ ] **Step 6: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

- [ ] **Step 7: 시각 검증**

dev 서버에서:
- Products 이후 FAQ 섹션 표시
- 각 질문 클릭 시 부드럽게 아코디언 확장
- 쉐브런 아이콘이 180도 회전
- HTML 에 `<script type="application/ld+json">` 태그 2개 (Organization + FAQPage) 있는지 확인

- [ ] **Step 8: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/components/Faq.astro src/components/FaqItem.astro \
        src/scripts/faq.ts src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: FAQ 섹션 (6 질문 아코디언 + FAQPage schema.org)"
```

---

## Task 9: Contact 서브카피 확장

**Files:**
- Modify: `src/components/Contact.astro`

- [ ] **Step 1: 서브카피 한 줄 교체**

`<p class="subcopy">작은 프로젝트도, 큰 프로젝트도 환영합니다.</p>` 를 찾아 아래로 변경:

```astro
<p class="subcopy">
  작은 프로젝트도, 큰 프로젝트도 환영합니다.
  첫 답변은 평일 기준 24시간 내로 드립니다.
</p>
```

- [ ] **Step 2: 빌드 + 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -5
git add src/components/Contact.astro
git commit -m "copy: Contact 서브카피에 '24시간 내 답변' 약속 추가"
```

---

## Task 10: Hero 서브카피 3문장 확장

**Files:**
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: 서브카피 교체**

기존:
```astro
      <p class="subcopy">
        웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오.
      </p>
```

변경:
```astro
      <p class="subcopy">
        웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오.
        <br />
        한 명의 사용자, 한 건의 데이터까지 놓치지 않는 탄탄한 시스템을 만듭니다.
        <br />
        쓰이는 소프트웨어는 <span class="subcopy-highlight">오래 쓰이는 소프트웨어</span>가 되어야 합니다.
      </p>
```

- [ ] **Step 2: 스타일 추가**

`.subcopy` 규칙 아래에 `.subcopy-highlight` 추가:

```css
  .subcopy-highlight {
    color: var(--color-accent);
    font-weight: 700;
  }
```

- [ ] **Step 3: max-width 조정**

기존 `.subcopy` 의 `max-width: 560px` 을 `max-width: 620px` 로 늘림 (3문장이 한 줄에 너무 좁게 wrap 되지 않도록).

```css
  .subcopy {
    font-size: clamp(15px, 1.3vw, 19px);
    color: var(--color-text-secondary);
    line-height: 1.75;
    max-width: 620px;
    margin: 0 0 32px;
  }
```

- [ ] **Step 4: 빌드 + 시각 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -5
```

dev 서버에서 Hero 서브카피가 3문장으로 길어지고 "오래 쓰이는 소프트웨어" 가 틸 컬러로 강조되는지 확인.

- [ ] **Step 5: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/components/Hero.astro
git commit -m "copy: Hero 서브카피 1→3문장 확장 + 핵심 문구 강조"
```

---

## Task 11: SEO schema.org 추가 (Product, Service, FAQPage는 이미 Task 8에서)

**Files:**
- Modify: `src/layouts/Base.astro`

> 참고: FAQPage 는 Task 8 에서 Faq.astro 안에 이미 삽입됨. 이 task 는 Product + ProfessionalService 만 추가.

- [ ] **Step 1: Base.astro 의 jsonLd 변수를 배열로 확장**

기존:
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Taktonlabs',
  url: 'https://taktonlabs.com',
  logo: 'https://taktonlabs.com/favicon.svg',
  description: description,
  sameAs: [],
};
```

변경:
```typescript
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Taktonlabs',
  url: 'https://taktonlabs.com',
  logo: 'https://taktonlabs.com/favicon.svg',
  description: description,
  sameAs: [],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KR',
    addressRegion: '경상남도',
    addressLocality: '양산시',
    streetAddress: '하북면 신평로 18, 1층',
  },
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TutorMate',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Windows, macOS',
  description:
    '60대 이상 강사의 수강 관리를 쉽게. 수강생 · 결제 · 대시보드까지 직관적으로.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Takton Labs',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Takton Labs',
  url: 'https://taktonlabs.com',
  description: '웹·모바일·데스크톱 소프트웨어 개발 스튜디오',
  areaServed: {
    '@type': 'Country',
    name: 'South Korea',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '소프트웨어 개발 서비스',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '웹·모바일 제품 개발',
          description: 'SaaS, 웹앱, 반응형 사이트',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '데스크톱 앱 개발',
          description: 'Electron 기반 크로스플랫폼',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'B2B 맞춤 소프트웨어 개발',
          description: '업무 흐름에 맞춘 맞춤 개발',
        },
      },
    ],
  },
};
```

- [ ] **Step 2: `<head>` 안의 JSON-LD 삽입 부분 수정**

기존:
```astro
    <!-- JSON-LD -->
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

변경:
```astro
    <!-- JSON-LD: Organization + Product + Service -->
    <script type="application/ld+json" set:html={JSON.stringify(organizationSchema)} />
    <script type="application/ld+json" set:html={JSON.stringify(productSchema)} />
    <script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
```

- [ ] **Step 3: 메타 태그 keyword + geo 추가**

기존 `<link rel="canonical">` 아래에 추가:

```astro
    <meta name="keywords" content="텍톤랩스, Takton Labs, 소프트웨어 스튜디오, 수강 관리 프로그램, TutorMate, 양산 소프트웨어 개발, Electron 데스크톱 앱, B2B 맞춤 개발" />
    <meta name="author" content="Takton Labs" />
    <meta name="geo.region" content="KR-48" />
    <meta name="geo.placename" content="양산" />
```

- [ ] **Step 4: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -5
```

- [ ] **Step 5: HTML 출력 확인**

```bash
cd /Users/kjh/dev/taktonlabs-web
grep -o '<script type="application/ld+json"' dist/index.html | wc -l
```

Expected: `4` (Organization + Product + Service + FAQPage)

- [ ] **Step 6: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/layouts/Base.astro
git commit -m "feat: SEO schema.org 확장 (Product + ProfessionalService + geo meta)"
```

---

## Task 12: 스크롤 애니메이션 함수 3개 추가

**Files:**
- Modify: `src/scripts/scroll-animations.ts`

- [ ] **Step 1: Philosophy 애니메이션 함수 추가**

`scroll-animations.ts` 파일 맨 아래에 아래 3개 함수 추가:

```typescript
/**
 * Philosophy 섹션: 카드 stagger reveal + 핵심 단어 밑줄 draw-in
 */
function animatePhilosophy(): void {
  const cards = document.querySelectorAll('[data-philosophy-card]');
  if (cards.length === 0) return;

  gsap.from(cards, {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  // 강조 단어 밑줄 draw-in
  const highlights = document.querySelectorAll<HTMLElement>(
    '[data-philosophy-highlight] .underline'
  );
  highlights.forEach((underline) => {
    gsap.to(underline, {
      scaleX: 1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: underline,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      delay: 0.3,
    });
  });
}

/**
 * Process 섹션: 데스크톱은 sticky rail 활성 마커 업데이트,
 * 모바일은 step stagger reveal.
 */
function animateProcessSection(): void {
  const steps = document.querySelectorAll<HTMLElement>('[data-process-step]');
  if (steps.length === 0) return;

  if (!isDesktop()) {
    gsap.from(steps, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#process',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });
    return;
  }

  // Desktop: ScrollTrigger 로 각 step 활성화 시 rail marker 하이라이트
  const markers = document.querySelectorAll<HTMLElement>('[data-rail-marker]');

  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 60%',
      onEnter: () => activateMarker(i),
      onEnterBack: () => activateMarker(i),
    });
  });

  function activateMarker(index: number): void {
    markers.forEach((marker, i) => {
      if (i === index) {
        marker.setAttribute('data-active', 'true');
      } else {
        marker.removeAttribute('data-active');
      }
    });
  }

  // 첫 번째 마커 기본 활성 (페이지 진입 시)
  if (markers[0]) markers[0].setAttribute('data-active', 'true');
}

/**
 * Why 섹션: 카드 stagger reveal
 */
function animateWhy(): void {
  const cards = document.querySelectorAll('[data-why-card]');
  if (cards.length === 0) return;

  gsap.from(cards, {
    y: 32,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#why',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });
}
```

- [ ] **Step 2: `initScrollAnimations` 에서 3개 함수 호출**

기존 `initScrollAnimations` 함수 안에서 기존 호출 뒤에 추가:

```typescript
export function initScrollAnimations(): void {
  if (prefersReducedMotion()) {
    showAllImmediately();
    return;
  }

  syncLenisWithScrollTrigger();

  animateHero();
  animateSectionHeaders();
  animateCapabilities();
  animateProductsSection();
  animateContact();

  // v2 신규 섹션
  animatePhilosophy();
  animateProcessSection();
  animateWhy();
}
```

- [ ] **Step 3: `showAllImmediately` 에 신규 셀렉터 추가**

```typescript
function showAllImmediately(): void {
  // 기존
  gsap.set('.word', { opacity: 1, y: 0 });
  gsap.set('[data-window]', { opacity: 1, scale: 1 });
  gsap.set('[data-mint-line]', { scaleX: 1 });
  gsap.set('[data-reveal]', { opacity: 1, y: 0 });
  // v2 신규
  gsap.set('[data-philosophy-card]', { opacity: 1, y: 0 });
  gsap.set('[data-philosophy-highlight] .underline', { scaleX: 1 });
  gsap.set('[data-process-step]', { opacity: 1, y: 0 });
  gsap.set('[data-why-card]', { opacity: 1, y: 0 });
  // 첫 번째 rail marker 활성
  const firstMarker = document.querySelector('[data-rail-marker]');
  if (firstMarker) firstMarker.setAttribute('data-active', 'true');
}
```

- [ ] **Step 4: `animateSectionHeaders` 셀렉터에 신규 섹션 헤더 추가**

기존:
```typescript
function animateSectionHeaders(): void {
  const headers = document.querySelectorAll(
    '#capabilities .capabilities-header, #products .products-header, #contact .contact-header'
  );
  ...
```

변경 (Philosophy/Process/Why/FAQ 헤더도 같은 애니메이션 적용):
```typescript
function animateSectionHeaders(): void {
  const headers = document.querySelectorAll(
    '#capabilities .capabilities-header, #products .products-header, #contact .contact-header, #philosophy .philosophy-header, #process .process-header, #why .why-header, #faq .faq-header'
  );
  ...
```

- [ ] **Step 5: 빌드 검증**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -10
```

- [ ] **Step 6: 시각 검증**

dev 서버에서:
- Philosophy 카드 3개가 스크롤 진입 시 stagger 등장
- 각 카드의 핵심 단어(장부처럼 / 한눈에 / 파트너) 아래 밑줄이 좌→우로 draw-in
- Process 섹션을 스크롤할 때 왼쪽 sticky rail 의 활성 마커가 바뀌는지 (데스크톱)
- Why 4카드가 stagger 등장
- reduced-motion 설정 시 모든 요소가 즉시 표시되는지

- [ ] **Step 7: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add src/scripts/scroll-animations.ts
git commit -m "feat: v2 섹션 스크롤 애니메이션 (Philosophy/Process/Why) + reduced-motion 폴백"
```

---

## Task 13: 반응형 & 브라우저 검증

**Files:** (수정 없음, 관찰/필요 시 수정)

- [ ] **Step 1: 빌드 + preview 서버 기동**

```bash
cd /Users/kjh/dev/taktonlabs-web && pnpm build 2>&1 | tail -5
pnpm preview --port 4321 2>&1 &
sleep 3
curl -sI http://localhost:4321 | head -2
```

Expected: HTTP/1.1 200 OK

- [ ] **Step 2: 수동 반응형 점검 — 6개 뷰포트**

개발자 도구 반응형 모드에서 아래 각 뷰포트로 전 섹션 스크롤:

| 뷰포트 | 체크 |
|---|---|
| 360 × 780 (iPhone SE) | 모든 섹션 1열 스택, overflow-x 없음 |
| 640 × 960 (작은 태블릿) | Philosophy 1열, Why 1열 |
| 768 × 1024 (태블릿 세로) | Process sticky 비활성, 일반 스크롤 |
| 1024 × 768 (태블릿 가로) | Process sticky 활성 시작, Philosophy 2+1 |
| 1280 × 800 (노트북) | 모든 섹션 풀 레이아웃 |
| 1920 × 1080 (FHD) | 중앙 프레임, 양옆 여백 |

각 뷰포트에서 문제 있으면 해당 컴포넌트 CSS 에서 media query 추가 수정.

- [ ] **Step 3: 주요 인터랙션 수동 확인**

1. 페이지 로드 → Hero 단어 stagger 등장
2. Philosophy 까지 스크롤 → 3 카드 + 밑줄 애니메이션
3. Process 까지 스크롤 (데스크톱) → 왼쪽 rail 마커 이동
4. Why 까지 스크롤 → 4 카드 stagger
5. Products 다크 전환
6. FAQ 질문 클릭 → 아코디언 확장/수축
7. Contact 으로 복귀
8. Nav 앵커 (역량/제품/문의) 클릭 → 각 섹션으로 Lenis 스크롤

- [ ] **Step 4: prefers-reduced-motion 확인**

Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → `reduce` → 새로고침

모든 섹션이 애니메이션 없이 즉시 렌더링되어야 함. 사업자 정보, FAQ, Philosophy 모두 정상 표시.

- [ ] **Step 5: 발견된 이슈 수정 (있으면)**

수정한 파일:
```bash
cd /Users/kjh/dev/taktonlabs-web
git add -u
git commit -m "fix: 반응형/인터랙션 이슈 수정 (수동 검증 후)"
```

이슈 없으면 스킵.

---

## Task 14: Playwright 스모크 테스트 7개 추가

**Files:**
- Modify: `tests/smoke.spec.ts`

- [ ] **Step 1: 기존 `tests/smoke.spec.ts` 맨 아래에 v2 describe 블록 추가**

```typescript
test.describe('v2 신규 섹션', () => {
  test('Philosophy 섹션 3 카드 렌더링', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#philosophy')).toBeVisible();
    const cards = page.locator('[data-philosophy-card]');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toContainText('튼튼한 장부처럼');
    await expect(cards.nth(1)).toContainText('한눈에 보이는 지표');
    await expect(cards.nth(2)).toContainText('함께 성장하는 파트너');
  });

  test('Process 섹션 4 단계 렌더링', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#process')).toBeVisible();
    const steps = page.locator('[data-process-step]');
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(0)).toContainText('이해');
    await expect(steps.nth(3)).toContainText('출시는 시작입니다');
  });

  test('Why 섹션 4 카드 렌더링', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#why')).toBeVisible();
    const cards = page.locator('[data-why-card]');
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toContainText('만든 사람이 끝까지');
    await expect(cards.nth(3)).toContainText('소스코드 완전 양도');
  });

  test('FAQ 아코디언 동작', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#faq')).toBeVisible();

    const items = page.locator('[data-faq-item]');
    await expect(items).toHaveCount(6);

    const firstItem = items.nth(0);
    const firstTrigger = firstItem.locator('[data-faq-trigger]');
    const firstAnswer = firstItem.locator('[data-faq-answer]');

    // 초기 닫힘 상태
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');

    // 클릭 → 열림
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(firstItem).toHaveAttribute('data-open', 'true');

    // 애니메이션 대기 후 max-height 변화 확인
    await page.waitForTimeout(500);
    const maxHeight = await firstAnswer.evaluate((el) => el.style.maxHeight);
    expect(maxHeight).not.toBe('0');
    expect(maxHeight).not.toBe('');

    // 다시 클릭 → 닫힘
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
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
```

- [ ] **Step 2: Chromium 으로 v2 테스트만 실행**

```bash
cd /Users/kjh/dev/taktonlabs-web
pnpm exec playwright test --project=chromium -g "v2 신규 섹션" 2>&1 | tail -20
```

Expected: 7 passed

- [ ] **Step 3: 전체 테스트 스위트 실행 (3 브라우저)**

```bash
cd /Users/kjh/dev/taktonlabs-web
pnpm exec playwright test 2>&1 | tail -10
```

Expected: 75 passed (기존 18 × 3 브라우저 + 신규 7 × 3 브라우저 = 25 × 3 = 75)

만약 실패가 있으면 `pnpm exec playwright test --reporter=list` 로 상세 확인 후 수정.

- [ ] **Step 4: 커밋**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add tests/smoke.spec.ts
git commit -m "test: v2 섹션 스모크 테스트 7개 추가 (Philosophy/Process/Why/FAQ + schemas + Geist)"
```

---

## Task 15: Lighthouse + Rich Results 검증

**Files:** (수정 없음, 측정 + 필요 시 수정)

- [ ] **Step 1: 프로덕션 빌드 preview**

```bash
cd /Users/kjh/dev/taktonlabs-web
pkill -f "astro dev" 2>/dev/null
pkill -f "astro preview" 2>/dev/null
pnpm build 2>&1 | tail -10
pnpm preview --port 4321 2>&1 &
sleep 3
```

- [ ] **Step 2: Lighthouse 감사 (Mobile)**

Chrome DevTools → Lighthouse → Mobile → Performance + Accessibility + Best Practices + SEO 체크 → Analyze.

목표:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

- [ ] **Step 3: Lighthouse 감사 (Desktop)**

Desktop 프리셋으로 동일 감사. 목표 동일.

- [ ] **Step 4: 번들 사이즈 체크**

```bash
cd /Users/kjh/dev/taktonlabs-web
find dist -name "*.css" -exec ls -lh {} \;
find dist -name "*.js" -exec ls -lh {} \;
du -sh dist/
```

목표:
- 초기 JS (gzipped) < 150KB
- 초기 CSS (gzipped) < 30KB
- Geist 폰트 < 150KB

gzip 수동 확인:
```bash
cd /Users/kjh/dev/taktonlabs-web/dist/_astro
for f in *.css *.js; do
  size=$(gzip -c "$f" | wc -c)
  echo "$f: $(echo "scale=1; $size/1024" | bc) KB"
done
```

- [ ] **Step 5: Rich Results Test (수동)**

1. `pnpm preview` 종료
2. feat 브랜치 Cloudflare Pages preview URL 확인 (git push 후 대기)
3. `https://search.google.com/test/rich-results` 접속
4. Cloudflare preview URL 입력
5. 검출 결과 확인 — 아래 4개 항목이 detected 되어야 함:
   - Organization
   - SoftwareApplication (TutorMate)
   - ProfessionalService
   - FAQPage

⚠️ 이 단계는 feat 브랜치 push 후 수행. 로컬에서는 불가 (Google 이 URL 에 접근해야 함).

- [ ] **Step 6: 성능 이슈 있으면 수정**

흔한 이슈 + 해결:
- **LCP 느림** → Hero 로고 preload 확인, `fetchpriority="high"` 이미 적용됨
- **Unused CSS** → Tailwind 가 자동 제거. 여전히 경고면 불필요한 스타일 제거
- **Bundle 너무 큼** → GSAP lazy import 이미 적용됨
- **CLS** → FAQ 아코디언 이미 `max-height` 사용 (reflow 유발 가능). 심하면 `contain: layout` 추가

수정사항 있으면:
```bash
cd /Users/kjh/dev/taktonlabs-web
git add -u
git commit -m "perf: Lighthouse v2 감사 후 최적화"
```

- [ ] **Step 7: 최종 커밋이 없으면 스킵**

이슈 없으면 이 task 는 관찰만 하고 종료.

---

## Task 16: 최종 검증 + 접근성 패스

**Files:** (수정 없음 또는 마이너 수정)

- [ ] **Step 1: axe-core 자동 검사 (프로덕션 빌드 상대)**

preview 서버 기동 후 브라우저 콘솔에서:

```javascript
import('https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js').then(() => {
  axe.run().then((results) => {
    console.log('== axe-core 결과 ==');
    console.log('Violations:', results.violations.length);
    results.violations.forEach((v) => {
      console.log(`[${v.impact}] ${v.id}: ${v.description}`);
      v.nodes.forEach((n) => console.log('  →', n.target.join(' ')));
    });
  });
});
```

Expected: Violations 0 (또는 moderate 이하만)

발견되는 흔한 이슈:
- FAQ 버튼 라벨 부족 → `aria-label` 이미 `aria-controls` 있음 OK
- 섹션 제목 계층 (h1 → h2 → h3) 확인
- 색상 명도비 (dt/dd 회색 처리가 AA 기준 통과하는지)

수정 후 재검사.

- [ ] **Step 2: 키보드 네비게이션 수동 체크**

Tab 키로 순차 이동 — 예상 순서:

1. Skip link ("본문으로 건너뛰기")
2. Nav 로고
3. Nav 역량 / 제품 / 문의
4. Hero Primary CTA / Secondary CTA
5. Philosophy 카드 (non-interactive, skip)
6. Capability cards (non-interactive)
7. Process steps (non-interactive)
8. Why cards (non-interactive)
9. Products "자세히 보기" (tutomate 링크)
10. FAQ 트리거 6개 (Enter/Space 로 토글 가능)
11. Contact 이메일 카드 / 폼 필드들 / 제출 버튼
12. Footer 링크들

각 요소에서 포커스 링 (`box-shadow: 0 0 0 4px rgba(8,145,178,0.2)`) 명확히 보여야 함.

- [ ] **Step 3: 이슈 있으면 수정**

```bash
cd /Users/kjh/dev/taktonlabs-web
git add -u
git commit -m "a11y: v2 접근성 패스 수정"
```

이슈 없으면 스킵.

- [ ] **Step 4: 최종 전체 Playwright 재실행**

```bash
cd /Users/kjh/dev/taktonlabs-web
pnpm exec playwright test 2>&1 | tail -10
```

Expected: 모든 테스트 PASS (75/75).

- [ ] **Step 5: feat 브랜치 push (Cloudflare preview 빌드 트리거)**

```bash
cd /Users/kjh/dev/taktonlabs-web
git checkout feat/landing-implementation
git push origin feat/landing-implementation 2>&1 | tail -5
```

- [ ] **Step 6: Cloudflare Pages preview URL 에서 최종 확인**

- 8 섹션 모두 렌더링
- 폰트 Geist 로딩 (Network 탭)
- 스크롤 인터랙션 정상
- FAQ 아코디언 동작
- sticky progress rail 동작 (데스크톱)
- reduced-motion 정상 폴백

이 task 는 관찰 + 필요 시 수정만. 별도 커밋 없음.

---

## 구현 완료 체크리스트

### 기능
- [ ] Hero 서브카피 1→3문장 확장
- [ ] Philosophy 섹션 렌더링 + 3 카드 + 밑줄 draw-in
- [ ] Capabilities 카드 확장 설명 + 기술 태그
- [ ] Process 섹션 + 4 단계 + 데스크톱 sticky rail
- [ ] Why Takton Labs 4 카드
- [ ] Products 헤드라인 수정
- [ ] FAQ 아코디언 + 6 질문
- [ ] Contact 서브카피 확장

### 타이포그래피
- [ ] GeistVariable.woff2 자가 호스트
- [ ] InterVariable.woff2 제거
- [ ] tokens.css font-sans 업데이트
- [ ] font-feature-settings 업데이트
- [ ] Base.astro preload 업데이트

### SEO
- [ ] Organization schema (확장)
- [ ] SoftwareApplication schema (TutorMate)
- [ ] ProfessionalService schema
- [ ] FAQPage schema (Faq.astro 내부)
- [ ] meta keywords + geo tags
- [ ] h1~h3 시맨틱 계층

### 인터랙션
- [ ] animatePhilosophy (reveal + 밑줄)
- [ ] animateProcessSection (sticky rail + 모바일 stagger)
- [ ] animateWhy (카드 stagger)
- [ ] FAQ 아코디언 click handler
- [ ] reduced-motion 폴백

### 테스트
- [ ] 7 신규 Playwright 스모크 케이스
- [ ] 75/75 전체 테스트 PASS
- [ ] Lighthouse Mobile 90+
- [ ] Lighthouse Desktop 90+
- [ ] 키보드 네비게이션 완전
- [ ] axe-core violations 0

### 배포
- [ ] feat/landing-implementation 브랜치 push
- [ ] Cloudflare Pages preview 빌드 성공
- [ ] preview URL 에서 실기기 확인
- [ ] Rich Results Test 4개 schema detected
