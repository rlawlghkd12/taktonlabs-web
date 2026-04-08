# Taktonlabs 랜딩페이지 디자인 스펙

**작성일:** 2026-04-09
**상태:** 디자인 확정, 구현 대기

## 1. 컨텍스트

### 목적
Taktonlabs를 신뢰할 수 있는 소프트웨어 스튜디오로 포지셔닝한다. TutorMate는 우리가 만든 여러 제품 중 하나이며, 이 랜딩페이지는 제품 홍보가 아닌 **회사 브랜드/신뢰도** 확보를 목적으로 한다.

### 대상
한국어 사용 일반 방문객 전반 (특정 타겟 없음). 잠재 B2B 고객, 파트너, 관심 있는 개인 개발자/디자이너 등이 혼재한다.

### 성공 기준
방문자가 페이지를 경험한 뒤 다음을 느껴야 한다:
- "이 사람들 진짜 소프트웨어 잘 만드는구나"
- "믿고 일 맡길 만하다"
- "연락해서 이야기해봐야겠다"

**핵심 전략:** 소프트웨어 스튜디오에게 랜딩페이지 자체가 포트폴리오다. 카피로 능력을 주장하는 대신, **인터랙티브한 페이지 경험** 그 자체가 능력의 증거가 된다. "사람들은 문구를 잘 안 본다"는 전제를 설계에 반영한다.

## 2. 스코프 결정

### In Scope
- 단일 페이지 (`/`) 랜딩
- 한국어 단일
- 4개 섹션: Hero → 핵심 역량 → 제품 → 문의
- Tier 2 Scroll Storytelling 수준의 인터랙티브
- 모바일 퍼스트 반응형
- 문의 폼 (백엔드 없이 Web3Forms)
- 커스텀 도메인 (`taktonlabs.com`)
- Cloudflare 이메일 포워딩

### Out of Scope (YAGNI)
- 다국어 지원
- 블로그
- 팀/회사 소개 섹션 (공개할 팀 정보 없음)
- 케이스 스터디 / 포트폴리오 그리드 (보여줄 실적이 TutorMate 1개)
- 채용 페이지
- 라이트/다크 모드 토글 (전역)
- CMS 통합
- 뉴스레터 구독
- 애널리틱스 (추후 GA4 또는 Plausible 추가 여지)
- 법적 페이지 (개인정보처리방침, 이용약관) — 풋터에 placeholder만

## 3. 시각 방향

### 기본 톤
- **Clean / Light** 베이스 (밝은 배경, 네이비 텍스트)
- **제품 섹션만 다크 블록** 으로 극적 대비 — 라이트→다크 전환이 페이지의 클라이맥스 역할
- 로고의 네이비/틸 그라디언트 팔레트 확장

### 컬러 팔레트
| 역할 | 값 |
|---|---|
| 배경 (기본) | `#fff` |
| 배경 (section alt) | `#fafbfc` |
| 배경 (다크 블록) | `linear-gradient(180deg, #0a1929 0%, #0f2340 100%)` |
| 텍스트 (primary) | `#0a1929` (Navy) |
| 텍스트 (secondary) | `#6b7280` |
| 액센트 (라이트) | `#0891b2` (Teal) |
| 액센트 (다크) | `#5eead4` (Mint) |
| 테두리 | `#e5e7eb` |

### 타이포그래피
- **한국어:** Pretendard Variable (웹폰트, subset)
- **라틴:** Inter (또는 시스템 폴백)
- **히어로 헤드라인:** `clamp(32px, 6vw, 56px)` / weight 900
- **섹션 제목:** `clamp(22px, 4vw, 32px)` / weight 800
- **본문:** `15px` (모바일) / `16px` (데스크톱) / line-height 1.7

### 아이콘
- **Lucide Icons** via `astro-icon` 인티그레이션
- 커스텀 SVG는 히어로 헥사곤만 (로고 모티프 확장)

## 4. 페이지 구조

### 4.1. Navigation
- 스티키 상단, 블러 backdrop
- 좌측: 헥사곤 로고 (28×28) + "TAKTONLABS" 워드마크
- 우측 (데스크톱): 앵커 링크 "역량 · 제품 · 문의"
- 우측 (모바일): 링크 3개를 그대로 노출 (햄버거 불필요 — 항목이 적음). 글자 크기만 축소.
- 클릭 시 앵커로 스무스 스크롤 (Lenis 사용)

### 4.2. Hero
- **헤드라인:** "제품을 만듭니다. 끝까지."
- **서브카피:** "웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오."
- **Primary CTA:** "제품 둘러보기 →" (→ `#products`)
- **Secondary CTA:** "문의하기" (→ `#contact`)
- **비주얼:** 우측 (데스크톱) / 상단 (모바일) 에 커스텀 3D 헥사곤 로고. 네이비/틸 그라디언트. 내부에 상승 화살표 아이콘.

**인터랙션:**
- 헤드라인 단어 단위 페이드인 + 미세 Y translate (stagger 80ms)
- 헥사곤: 마우스 이동에 반응해 `rotateY/rotateX` 미세 변화 (데스크톱 only)
- 스크롤 진행도에 따라 헥사곤이 미세하게 축소/페이드 → 다음 섹션과 자연스럽게 연결

**모바일:**
- 헥사곤이 헤드라인 위로 이동 (세로 스택)
- 마우스 패럴럭스 비활성
- 헥사곤 크기 축소 (`140px → 100px`)

### 4.3. 핵심 역량 (Capabilities)
- **제목:** "세 가지 영역에서 끝까지 만듭니다"
- **서브카피:** (선택) "하나를 만들어도 처음부터 끝까지 직접 합니다."
- **3개 카드** (가로 그리드, 데스크톱 / 세로 스택, 모바일):
  1. **웹·모바일 제품** (Lucide `layout-grid`) — "SaaS, 웹앱, 반응형 사이트. 기획 · 디자인 · 개발 · 배포"
  2. **데스크톱 앱** (Lucide `app-window`) — "Electron 기반 크로스플랫폼. 자동 업데이트 · 코드 사이닝 · 배포까지"
  3. **B2B 맞춤 개발** (Lucide `blocks`) — "업무 흐름을 이해하고 거기에 맞는 도구를 만듭니다"

**인터랙션 (데스크톱):**
- 섹션이 뷰포트에 **pin** 됨 (ScrollTrigger `pin: true`)
- 스크롤 진행에 따라 3개 카드가 순차적으로 "active" 상태 전환 (그림자 + 미세 스케일 + 보더 컬러)
- 섹션 스크롤 완료 후 unpin

**모바일:**
- **Pin 비활성** — 일반 스크롤
- 카드가 뷰포트 진입 시 각자 페이드인 + slide up (IntersectionObserver)
- 한 카드씩 세로로 크게 표시

### 4.4. 제품 (Products) — Dark Block
- **배경:** 다크 그라디언트 `#0a1929 → #0f2340`
- **제목:** "이론이 아닙니다. 실제로 만들고 운영합니다."
- **서브카피:** "현재 출시 · 운영 중인 제품"
- **TutorMate 카드** (좌: 정보, 우: 앱 윈도우 목업):
  - "주력 제품" 라벨
  - 제품명: TutorMate
  - 설명: "60대 이상 강사의 수강 관리를 쉽게. 수강생 · 결제 · 대시보드까지 직관적으로."
  - 태그: Electron · Win · Mac · 자동 업데이트
  - CTA: "자세히 보기 →" — 초기 구현은 `#` 앵커로 처리하고, TutorMate 제품 페이지가 준비되면 URL 연결 (Open Questions 참조)
- **우측 비주얼:** 스타일라이즈된 앱 윈도우 프레임 + 내부 UI 플레이스홀더 블록

**인터랙션 (가장 강한 임팩트):**
- **라이트→다크 전환**: 이전 섹션 끝→이 섹션 시작 지점에서 배경이 드라마틱하게 페이드 (body 배경 or GSAP timeline)
- TutorMate 앱 윈도우가 뷰포트 진입 시 "열리며" 내부 UI 요소들이 stagger 등장 (창 헤더 → 네비 → 본문 → 카드 순)
- 태그 칩은 한 개씩 튀어나오는 pop-in

**모바일:**
- 좌우 2열 → 세로 1열 스택 (정보 상단, 윈도우 목업 하단)
- 드라마틱한 배경 전환은 유지 (성능 비용 낮음)
- 윈도우 UI stagger 등장은 단계 축소 (3단계 → 1단계)

### 4.5. 문의 (Contact)
- 배경 다시 라이트로 복귀 (다크→라이트 전환)
- **제목:** "프로젝트 이야기하러 오세요"
- **서브카피:** "작은 프로젝트도, 큰 프로젝트도 환영합니다."
- **2개 카드** (데스크톱 가로 / 모바일 세로):
  1. **이메일 카드** — 밝은 테두리 + 흰 배경. Lucide `mail` 아이콘 + `hello@taktonlabs.com` + "가볍게 안부, 질문 환영". `mailto:` 링크.
  2. **문의 폼 카드** — 네이비 배경 `#0a1929` + 민트 액센트. Lucide `send` 아이콘. **항상 인라인 폼** (모달 없음). 데스크톱에서도 카드 클릭 시 카드 내부에 폼이 펼쳐짐.
- **폼 필드:** 이름 (필수), 이메일 (필수), 프로젝트 내용 (필수), 회사명 (선택), 예산 범위 (선택)
- **제출:** Web3Forms API. 제출 후 폼 자리에 성공 애니메이션 인라인 표시 (체크마크 SVG draw-in + "연락드리겠습니다" 카피).

**모바일:**
- 2열 → 1열 스택 (이메일 카드 위, 폼 카드 아래)
- 폼 카드는 모바일에서 항상 펼쳐진 상태 (토글 없음 — 2단계 터치 부담 제거)

### 4.6. Footer
- 라이트 배경 `#f9fafb`
- 좌측: © 2026 Taktonlabs
- 우측: taktonlabs.com
- 미니멀. 소셜 링크 없음.

## 5. 기술 스택

| 계층 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Astro 6 (static) | 제로 JS 기본, 빠른 초기 로딩. 랜딩에 최적. |
| 스타일 | Tailwind v4 (`@tailwindcss/vite`) | 유틸리티 퍼스트, 빠른 빌드. 유저가 이미 익숙. |
| 애니메이션 | GSAP + ScrollTrigger | Tier 2 스크롤 스토리텔링 표준. 2024년부터 상업용 무료. |
| 부드러운 스크롤 | Lenis | 라이트웨이트, GSAP과 잘 맞음. |
| 아이콘 | `astro-icon` + Lucide | 트리쉐이킹, 인라인 SVG, 자유로운 조작. |
| 폼 | Web3Forms | 백엔드 불필요, 무제한 무료, 스팸 필터 내장. |
| 호스팅 | Cloudflare Pages | 무료 대역폭 무제한, 한국 CDN 우수, Pages Functions. |
| 이메일 | Cloudflare Email Routing | 커스텀 도메인 메일을 개인 Gmail로 무료 포워딩. |

### 패키지 추가 예정
```
pnpm add -D @tailwindcss/vite tailwindcss astro-icon @iconify-json/lucide
pnpm add gsap lenis
```

## 6. 디렉토리 구조

```
taktonlabs-web/
├── src/
│   ├── layouts/
│   │   └── Base.astro              # HTML shell, meta, 폰트, 글로벌 스타일
│   ├── pages/
│   │   └── index.astro             # 섹션 조합
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── HexagonLogo.astro       # 3D 헥사곤 (커스텀 SVG + CSS)
│   │   ├── Capabilities.astro
│   │   ├── CapabilityCard.astro
│   │   ├── Products.astro
│   │   ├── ProductCard.astro
│   │   ├── TutorMateWindow.astro   # 스타일라이즈 앱 윈도우 목업
│   │   ├── Contact.astro
│   │   ├── ContactForm.astro
│   │   └── Footer.astro
│   ├── scripts/
│   │   ├── scroll-animations.ts    # GSAP ScrollTrigger 타임라인
│   │   ├── smooth-scroll.ts        # Lenis 초기화
│   │   └── hexagon-interactive.ts  # 히어로 헥사곤 마우스 반응
│   └── styles/
│       └── global.css              # Tailwind import, 테마 토큰, 폰트
├── public/
│   ├── favicon.svg                 # 헥사곤 로고
│   └── og-image.png                # 소셜 공유용
├── astro.config.mjs                # astro-icon, tailwind 통합
├── package.json
└── wrangler.toml                   # Cloudflare Pages 설정 (선택)
```

## 7. 반응형 & 모바일 전략

### 브레이크포인트
```
sm: 640px   — 기본 모바일
md: 768px   — 태블릿
lg: 1024px  — 데스크톱
xl: 1280px  — 와이드
```

### 모바일 우선 원칙
1. **Pin 섹션 비활성** — 역량 섹션 pinning은 데스크톱 (`lg` 이상)에서만 활성. 모바일은 자연 스크롤 + IntersectionObserver 기반 진입 애니메이션.
2. **마우스 패럴럭스/호버 효과 비활성** — 터치 디바이스에서 의미 없음. `@media (hover: hover) and (pointer: fine)` 로 가드.
3. **레이아웃 전환** — 모든 가로 그리드는 모바일에서 세로 스택.
4. **타이포 스케일링** — 모든 제목은 `clamp()` 기반. 직접 미디어쿼리 분기 최소화.
5. **애니메이션 시퀀스 단축** — 모바일에서 stagger 단계 축소 (예: 5개 → 3개), duration 20~30% 단축.
6. **이미지 사이즈** — AVIF/WebP + 뷰포트 기반 `srcset`.

### 접근성 (Accessibility)
- `prefers-reduced-motion: reduce` → 모든 ScrollTrigger/GSAP 애니메이션 즉시 완료 상태로 점프. Lenis도 비활성.
- 포커스 표시 모든 인터랙티브 요소에 명확히.
- 의미 있는 `alt` 모든 이미지/아이콘에 (데코레이션은 `aria-hidden`).
- 키보드 전 흐름 네비 가능.
- 최소 명도비 4.5:1 (WCAG AA) — 다크 블록의 mint 텍스트/회색 서브텍스트 검증 필요.
- 폼: 모든 input에 `<label>`, 에러 메시지 `aria-live`.

## 8. 성능 예산

| 메트릭 | 목표 |
|---|---|
| LCP (Largest Contentful Paint) | < 2.0s |
| CLS (Cumulative Layout Shift) | < 0.05 |
| TBT (Total Blocking Time) | < 200ms |
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| 초기 JS 번들 (gzipped) | < 150KB |
| 초기 CSS (gzipped) | < 30KB |

**전략:**
- GSAP + ScrollTrigger + Lenis는 히어로 바로 아래에서 lazy init (IntersectionObserver 기반)
- 뷰포트 진입 전까지 애니메이션 스크립트 로드 지연
- 폰트 preload + `font-display: swap`
- 이미지는 모두 AVIF 1순위, WebP 폴백

## 9. SEO & 메타데이터

### 메타 태그
- `<title>`: "Taktonlabs — 제품을 만듭니다. 끝까지."
- `<meta name="description">`: "웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오."
- `<meta property="og:image">`: `og-image.png` (1200×630)
- `<meta property="og:type">`: `website`
- `<meta property="og:locale">`: `ko_KR`
- Open Graph title/description 동일
- Twitter Card `summary_large_image`

### 구조화 데이터
- JSON-LD `Organization` 스키마 (회사명, URL, 로고)

### sitemap
- `@astrojs/sitemap` 인티그레이션 (단일 페이지라 단순)

## 10. 테스트 전략

스코프가 마케팅 사이트라 전통적 유닛 테스트는 가치가 낮다. 대신:

### 필수
- **Lighthouse 감사** — Performance/Accessibility/Best Practices/SEO 각 90+
- **수동 반응형 체크** — 360px / 768px / 1280px / 1920px 에서 모든 섹션 확인
- **prefers-reduced-motion 검증** — 시스템 설정 켠 상태에서 방문, 애니메이션 비활성 확인
- **키보드 네비게이션** — Tab으로 모든 인터랙티브 요소 접근 가능
- **크로스 브라우저** — 최신 Chrome · Safari · Firefox · Edge, iOS Safari · Chrome Android

### Playwright 스모크 (최소)
1. 페이지 로드 → 콘솔 에러 없음
2. 각 앵커 링크 클릭 → 해당 섹션 스크롤 확인
3. 문의 폼 제출 (네트워크 모킹) → 성공 상태 확인
4. `axe-core` 접근성 자동 검사 → critical 위반 0

### 나중에 고려
- Percy/Chromatic 비주얼 리그레션 (페이지가 자주 바뀌면)

## 11. 배포

### 초기 설정
1. GitHub 레포 생성 → `taktonlabs-web` 푸시
2. Cloudflare Pages 프로젝트 생성 → GitHub 연결
3. 빌드 명령: `pnpm build`, 출력: `dist/`
4. 환경 변수: `WEB3FORMS_ACCESS_KEY` 설정 (Cloudflare Pages 시크릿)
5. 프로덕션 브랜치: `main`

### 도메인 연결
1. Cloudflare Registrar에서 `taktonlabs.com` 구매 (~$9/년)
2. Cloudflare Pages 프로젝트에 커스텀 도메인 추가
3. Email Routing 활성화 → `hello@taktonlabs.com` → 개인 Gmail 포워딩
4. DNS: Pages 자동 설정 + MX 레코드 (Email Routing 자동)

### CI/CD
- `main` 브랜치 푸시 시 자동 배포
- PR 생성 시 프리뷰 배포 URL 자동 생성

## 12. 해결 보류 (Open Questions)

- **TutorMate 상세 링크:** 외부 제품 페이지가 있는지? 없으면 임시로 `#` 처리 후 나중에 업데이트
- **개인 Gmail 주소:** Cloudflare Email Routing 포워딩 대상
- **로고 에셋:** 랜딩페이지용 고해상도 SVG 로고 파일 준비 필요
- **OG 이미지:** 소셜 공유용 1200×630 이미지 디자인 필요
- **법인 정보:** 풋터에 사업자 등록번호 등 표시 의무가 있는지 확인
- **애널리틱스:** 초기 출시 후 GA4/Plausible 중 선택

## 13. 단계별 빌드 순서 (구현 계획 가이드)

다음 세션에서 `writing-plans` 스킬로 변환할 예정이지만 큰 흐름은:

1. **기본 인프라 세팅** — Tailwind v4, astro-icon, 폰트, 글로벌 스타일, 테마 토큰
2. **레이아웃 + Nav + Footer** — Base.astro, Nav, Footer (네비게이션 작동 확인)
3. **정적 마크업 전 섹션** — Hero, Capabilities, Products, Contact를 애니메이션 없이 먼저 마크업/스타일만 완성
4. **모바일 반응형 검증** — 모든 섹션을 모바일→데스크톱 순으로 점검
5. **문의 폼 제출** — Web3Forms 연동, 에러/성공 인라인 상태
6. **기본 인터랙션** — Lenis 스무스 스크롤, 진입 페이드/슬라이드 애니메이션 (GSAP 기본)
7. **Hero 헥사곤 3D** — 마우스 패럴럭스, 스크롤 반응
8. **핀 섹션 (역량)** — ScrollTrigger pin, 카드 순차 활성화 (데스크톱 전용)
9. **제품 섹션 라이트→다크 전환 + 윈도우 reveal**
10. **접근성 패스** — prefers-reduced-motion, 포커스, alt, axe-core 검증
11. **성능 패스** — Lighthouse 감사, 번들 사이즈 점검
12. **배포** — Cloudflare Pages, 커스텀 도메인, Email Routing
