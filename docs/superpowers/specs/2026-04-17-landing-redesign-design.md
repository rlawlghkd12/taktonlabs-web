# Takton Labs 랜딩 페이지 리디자인 · 디자인 스펙

**날짜:** 2026-04-17
**스코프:** `src/pages/index.astro` 및 관련 섹션 컴포넌트 9개
**방향 이름:** Quiet Kinetic (Kinetic Minimal + Apple product-page DNA)

---

## 1. 디자인 방향

편집 디자인의 차분함과 Apple 제품 페이지의 정교한 모션을 결합한다. 히어로에서 시작해 섹션별로 같은 타이포·모션 어휘를 반복하며 페이지를 "한 권의 편집물"로 엮는다. 시각 효과는 감상용이 아니라 전달력을 돕는 도구다.

**큰 원칙 5가지**

1. **타이포가 주인공.** 이미지·3D·그래픽이 아닌 문장과 숫자로 인상을 만든다.
2. **여백이 긴장감.** 각 섹션에 충분한 공백을 두고, 카피는 읽히는 속도로 등장한다.
3. **모션은 결정된 모션.** 부드러움(`cubic-bezier(0.16, 1, 0.3, 1)`)과 스태거로 유기적으로 느껴지게 한다. 튀거나 점멸하지 않는다.
4. **자랑할 수 있는 것만 자랑한다.** 약한 숫자·없는 클라이언트 로고·희미한 수치는 넣지 않는다.
5. **한국 SMB 신뢰 앵커 확보.** 사업자등록번호·카카오톡 채널·실제 위치·평일 응답 시간은 명시한다.

---

## 2. 비주얼 시스템

### 2.1 컬러

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg-primary` | `#fafaf7` (오프화이트) | 대부분 섹션 배경 |
| `--bg-dark` | `#0a0a0a` (근흑) | Products 섹션만 |
| `--text-primary` | `#0a0a0a` | 본문 텍스트 |
| `--text-secondary` | `rgba(10,10,10,0.7)` | 설명 텍스트 |
| `--hairline` | `rgba(10,10,10,0.12)` | 섹션 구분, 카드 디바이더 |
| `--hairline-strong` | `rgba(10,10,10,0.15)` | 섹션 상·하단 |
| `--accent-highlight` | `#fce38a` | Philosophy 선언문 내 키워드 하이라이트 스트립 |
| `--accent-q-blue` | `#0055cc` | TutorMate Q 표기만 (브랜드 유지) |

딥 블랙 섹션(Products)은 유일한 다크 전환으로 페이지 클라이맥스 신호 역할. 나머지는 모노크롬.

### 2.2 타이포그래피

| 역할 | 설정 | 사용처 |
|---|---|---|
| 본문 KR | Pretendard Variable, weight 400–600 | 모든 한글 |
| 본문 EN | system-ui, -apple-system | 영문 라벨·eyebrow |
| 모노스페이스 | `ui-monospace, 'SF Mono'` | eyebrow, 인덱스(01/02/03), 숫자 라벨 |
| 숫자 | `font-variant-numeric: tabular-nums`, `letter-spacing: -0.04em` | 통계·챕터 번호 |
| 대형 헤드라인 | weight 600, letter-spacing `-0.045em`, line-height 1.0–1.02 | 섹션 헤드 |
| 챕터 번호 | weight 700, stroke only (`-webkit-text-stroke: 1.5px`), 아웃라인 | Capabilities·Process·Why 숫자 |

핵심: 제목과 숫자는 **letter-spacing 타이트**(−0.03 ~ −0.06em). 한글 본문은 **line-height 1.7 이상** 확보.

### 2.3 모션 토큰

| 토큰 | 커브 | 용도 |
|---|---|---|
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | 섹션 진입, morph 전환 (Apple iOS 화면 전환 톤) |
| `--ease-smooth` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | 레이아웃 flex 전환, eyebrow 교체 |
| `--ease-detail` | `cubic-bezier(0.4, 0, 0.6, 1)` | opacity·max-height 페이드 |

**스태거 기준**
- 같은 블록 내부 요소: 0.08–0.15s 간격
- 같은 섹션의 여러 행: 0.15–0.2s 간격

**기본 지속 시간**
- 마이크로 인터랙션(호버·lift): 0.25s
- 블록 단위 페이드업: 0.5–0.7s
- 대형 morph (Capabilities·Products): 스크롤 진행도에 연동 (scrub)

### 2.4 그리드·여백

- 컨테이너 최대 폭: `1400px` (기존 `--container-wide` 계승)
- 섹션 기본 패딩: 세로 `96px`, 가로 `56px` (1440+ viewport)
- 섹션 간 리듬: 큰 섹션(Products 300vh pinned) / 보통 (Capabilities/Process) / 짧음 (Hero/Why/FAQ/Contact/Footer)

---

## 3. 공통 인터랙션

- **Lenis 스무스 스크롤** 유지 (기존 `scripts/smooth-scroll.ts`).
- **ScrollTrigger**는 Capabilities와 Products 두 섹션에서만 pin 사용. 과사용 금지.
- **커스텀 커서·스크롤 프로그레스**는 기존 코드 유지하되, 스크롤 프로그레스는 1px hairline top-align으로 리팩터.
- **Reduced motion**: `prefers-reduced-motion: reduce` 적용 시 모든 pin/scrub 비활성화, 컨텐츠는 최종 상태로 즉시 렌더.
- **모바일(≤768px)**: 모든 pin 섹션은 pin 해제. 컨텐츠는 세로 스택으로 자연 노출.

---

## 4. 섹션별 스펙

섹션 순서: Hero → Philosophy → Capabilities → Process → Why Takton → Products → FAQ → Contact → Footer.

---

### 4.1 Hero

**방향:** B — 거대 아웃라인 TAKTON 워드마크 + 풀블리드 타이포.

**컴포지션**
- 좌상단 eyebrow: `TAKTON LABS — SOFTWARE STUDIO · 양산` (10px, letter-spacing 0.25em)
- 헤드라인(72px, weight 600, line-height 1.02): "제품을 만듭니다." / "끝까지." (끝까지는 opacity 0.3 초기 → 스크롤 진입 시 1.0로 부드럽게 채움)
- 서브카피(17px, opacity 0.65, 최대폭 520px): 기존 카피 유지 (웹·모바일·데스크톱 …)
- CTA 2개: "제품 둘러보기 →" (primary, pill, `#0a0a0a`) / "문의하기" (secondary, ghost)
- 우측 배경: 거대 "TAKTON" 아웃라인 (`-webkit-text-stroke: 1.5px rgba(10,10,10,0.08)`), 화면 외곽으로 크게 걸침, 살짝 패럴랙스
- 우상단: `EST. 2024` / `양산 · KR` (10px, opacity 0.4). **수치·운영 통계 금지.**
- 우하단: `SCROLL ↓` 마이크로 라벨
- 히어로 하단: 조용한 마이크로 링크 `Now shipping — TutorMate ↘` — 클릭 시 Products 섹션으로 스무스 스크롤

**모션**
- 진입: 헤드라인 단어별 0.08s 간격 페이드업 + 8px Y translate
- 워드마크: 스크롤 시 `-30px` 정도 패럴랙스

**제거 대상 (현재 `Hero.astro`에서)**
- 3종 글로우 오브 (`.glow-orb--primary/secondary/tertiary`)
- 플로팅 로고 (`.hero-logo` + `logo-float` keyframe)
- `word-accent` shimmer 그라데이션
- `hero-bg-mesh` 방사형 그라데이션

### 4.2 Philosophy

**방향:** B — 풀폭 편집 레이아웃 + 가로 3분할 원칙.

**컴포지션**
- Eyebrow(10px 모노): `02 · PHILOSOPHY`
- 대형 선언문(80px, weight 600, letter-spacing −0.045em, max-width 1100px):
  "쓰이는 소프트웨어가 [오래 쓰이는] 소프트웨어입니다."
  "오래 쓰이는" 부분은 옐로 하이라이트 스트립(`#fce38a`, padding 0 6px, 65~92% 하단 영역).
- 얇은 헤어라인 디바이더.
- 가로 3분할 원칙:
  - `01 · ONE TEAM` / 설계·개발·운영을 / 한 팀이 전담합니다.
  - `02 · IN THE FIELD` / 쓰이는 장면을 / 직접 보고 고칩니다.
  - `03 · NO FRICTION LEFT` / 작은 마찰까지 오래 / 남겨두지 않습니다.

**모션**
- 선언문 단어별 0.1s 간격 페이드업
- 하이라이트 스트립은 스크롤 진행도 30% 지점에서 왼→오른쪽으로 draw (0.5s, ease-expo)
- 원칙 3개는 0.15s 간격 stagger

**제거 대상**
- 기존 `Philosophy.astro` + `PhilosophyCard.astro`의 카드 레이아웃 → 풀폭 선언문으로 교체

### 4.3 Capabilities (pinned morph — 페이지의 큰 인터랙션 ①)

**방향:** 섹션 pin + 카드 morph (BIG ↔ DOCK).

**메커닉**
- 섹션 높이: `300vh`, 내부 컨텐츠 `position: sticky; top: 0; height: 100vh`
- GSAP ScrollTrigger: `pin: true, scrub: 1` (살짝 관성)
- 3개 카드 각각 BIG 상태와 DOCK 상태를 타임라인으로 정의
- 스크롤 진행도 구간:
  - `0.00 – 0.22`: 01 BIG dwell
  - `0.18 – 0.38`: 01 shrink + 02 enter (겹침)
  - `0.40 – 0.56`: 02 BIG dwell
  - `0.56 – 0.74`: 02 shrink + 03 enter
  - `0.76 – 0.88`: 03 BIG dwell
  - `0.88 – 1.00`: 03 shrink + 최종 그리드

**BIG 상태 구성**
- 박스 `720px × 260px`, 좌우 flex
- 좌측: 번호(110px 아웃라인 stroke, 상단 38% 블랙 그라데이션 채움) / 타이틀(30px) / 설명(13px, opacity 0.72) / em-dash 원칙 3개
- 우측 프루프 프레임 (폭 280px, 카드별로 다름):
  - 01 **웹 · 모바일 제품**: 와이드 브라우저 미니 (타이틀 바 + 내부 2분할)
  - 02 **데스크톱 앱**: Mac 네이티브 창 (traffic lights + 사이드바 + TutorMate 대시보드 힌트)
  - 03 **B2B 맞춤 개발**: 정사각 대시보드 타일 4개 (월매출/미수금/결제/활성)

**DOCK 상태 구성**
- 박스 `220px × 54px`, 가로 flex
- 번호 16px + 타이틀 13px + 체크마크 (활성화 완료 신호)

**transition 타임라인 (예: 01 shrink 시)**
- `width/height/top/left/padding` 보간 (ease-expo)
- 숫자·타이틀 `font-size` 보간 (ease-expo)
- 설명 + 우측 프루프 → `opacity + max-height` 먼저 접힘 (ease-detail, 박스 모프보다 약간 선행)
- flex-direction column → row 전환 (ease-smooth)
- 체크마크 등장 (scale 0.7 → 1, ease-smooth)

**섹션 헤더 (pin 내부 최상단에 sticky)**
- 좌측 eyebrow: `CAPABILITIES / {active.title}` — 스크롤에 따라 01 → 02 → 03 업데이트 (fade + 4px Y, ease-smooth)
- 우측: 3-segment hairline progress bar (2px 높이 × 3개, 각 세그먼트가 해당 구간에서 `scaleX 0 → 1`)
- 섹션 진입 시 초대형 선언 카피 "세 가지로 만듭니다." 노출 → 첫 카드 BIG 상태로 자연 전환

**데이터 소스**
- 현재 `Capabilities.astro`에 인라인 작성되어 있음. 리디자인 시 `src/data/capabilities.ts` 신설 (iconName 제외, platform-specific 프루프 프레임 타입 필드 추가 검토).

**최종 상태 (상단 dock → 3 카드 re-balance)**
- 스크롤 0.88 이후 모든 카드가 dock row에 정렬
- 섹션 unpin, 결론 라인: "따로 맡겨도, 세 영역을 함께 설계해도." + "진행 방식 보기 ↓" 앵커

**추후 조정 (v4 이후 과제)**
- **BIG → DOCK 전환 시 텍스트(숫자·타이틀)의 좌상단 anchor 고정.** 현재 프로토타입은 컨테이너가 이동할 때 내부 텍스트가 같이 따라오는 구조. 실제 구현에서는 텍스트 origin은 고정한 채 `font-size`만 보간해야 자연스럽다.

**모바일**
- pin 해제. 3개 카드가 BIG 상태 그대로 세로 스택. 프루프 프레임도 그대로 노출.

### 4.4 Process

**방향:** B — 풀폭 편집 타임라인 (4 행 세로 스택). 차분한 쉬어가는 섹션.

**컴포지션**
- Eyebrow: `04 · PROCESS` (모노)
- 헤드라인(72px): "어느 단계에도 [지름길은 없습니다.]" (지름길은... opacity 0.35)
- 4 행, 각 행 `padding 44px 0`, 헤어라인 디바이더:
  - `[200px 숫자+라벨] [타이틀+설명] [원칙 em-dash 리스트]` 3열
  - 숫자 90px 아웃라인
  - 타이틀 24px, weight 600
  - 본문 14px, opacity 0.72
  - 원칙 3개, 14px, em-dash 시작

**모션**
- 진입 시 각 행 0.15s 간격 stagger 페이드업
- **pin 없음**, scroll-scrub 없음 — Capabilities의 무거운 인터랙션 뒤 숨고르기

**데이터 소스**
- `src/data/process.ts` 그대로 사용 (index·labelLatin·labelKo·subtitle·body·principles)

**제거 대상**
- 기존 `.hscroll-viewport`, `.hscroll-track`, `.hscroll-indicators`, `.hscroll-progress` 가로 스크롤 트랙 전체
- `scripts/interactive.ts`에서 hscroll 관련 로직

### 4.5 Why Takton (외주 공포 해소 4가지)

**방향:** A — 2×2 편집 카드 그리드.

**컴포지션**
- Eyebrow: `05 · WHY TAKTON`
- 헤드라인(56px): "네 가지 약속."
- 서브카피: **"우리가 반드시 지키는 네 가지."** (기존 "외주가 무서웠던..." 은 제거)
- 2×2 그리드, 박스 없음, 헤어라인 디바이더만 (상·하 + 사이 1px)
- 각 카드:
  - 상단: `01 · 지속성` 모노 14px + 우측 `↗` 아이콘
  - 타이틀 28px, weight 600: "만든 사람이 끝까지 함께합니다."
  - 본문 14px, opacity 0.72
- 하단 마무리(15px, opacity 0.65): "네 가지가 같이 지켜질 때만 '외주가 성공'이라 말할 수 있습니다."

**4 약속 (`src/data/why.ts` 갱신)**
- 기존 `iconName` 필드는 제거 (편집 디자인 톤에서 아이콘 쓰지 않음).
- `category` 필드 추가 ("지속성" / "개방성" / "투명성" / "접근성") — eyebrow에 노출.
- 목록:
  - 01 · 지속성 — 만든 사람이 끝까지 함께합니다.
  - 02 · 개방성 — 데이터는 완전히 당신의 것.
  - 03 · 투명성 — 투명한 비용, 명확한 기준.
  - 04 · 접근성 — 물어볼 곳이 있다는 안심.

**모션**
- 진입 시 4 카드 0.1s 간격 stagger 페이드업
- 호버: 카드 2px lift + ↗ 아이콘 opacity 0.3 → 0.7

**제거 대상**
- 기존 `WhyCard.astro` 아이콘 (lucide) — 타이포만으로 충분
- 기존 `.card-grid` 2열 카드 → 헤어라인 그리드

### 4.6 Products (TutorMate pinned screen-switch — 페이지의 큰 인터랙션 ②, 클라이맥스)

**방향:** 딥 블랙 섹션 + 핀된 Mac 창 + 스크롤에 따라 화면 교체.

**메커닉**
- 배경: `#0a0a0a`, 상단 라디얼 그라데이션 (rgba(255,255,255,0.04) at 50% 20%)
- 섹션 높이: `280vh`, 내부 스테이지 pin
- 3개 화면(대시보드 → 수강생 → 수익)을 진행도 3구간으로 전환
- Mac 창 테두리·traffic lights는 고정, **내부 컨텐츠만 크로스페이드 + scale 1.02 → 1.0**
- 좌측 캡션(타이틀·설명·원칙)도 화면 교체와 동기로 fade + 8px Y slide
- 사이드바 active item도 화면 바뀔 때 함께 이동
- 우측 3개 진행 인디케이터 (01/02/03 모노 라벨 + 2px 세로 라인, 활성 시 풀 선명도)
- 상단 3분할 progress bar 동기

**진입 헤드라인** (pin 시작 전 노출, pin 중에도 유지 가능)
- 68px: "이론이 아닙니다. / 매일 쓰고, 매주 고칩니다." (두 번째 줄 opacity 0.4)

**3 화면 컨텐츠**
- **01 · DASHBOARD** — 좌측 캡션 "한눈에 보이는 하루." / 우측 창: 상단 3-card(오늘 수업, 출석률, 미납), 하단 오늘 일정 타임라인
- **02 · STUDENTS** — "수강생, 놓치지 않게." / 우측 창: 수강생 리스트 테이블 (이름·수강권·잔여·상태 pill)
- **03 · REVENUE** — 좌측 캡션 "숫자가 먼저 말합니다." / 우측 창: 헤더에 `2026 · 4월 / ₩ 18,420,000 / 전월 대비 ▲ 12.4%`, 하단 월간 매출 바 차트 6개 + 최근 결제 142건 요약

**unpin 후 CTA 스트립**
- 좌측: `SHIPPING NOW` eyebrow + "지금 쓸 수 있습니다." (40px)
- 우측: `다운로드 →` (primary, 흰 pill) + `자세히 알아보기` (ghost)
- 하단 pill 4개: `Windows · macOS` / `자동 업데이트` / `오프라인 동작` / `무료 체험`

**모바일**
- pin 해제. 헤드라인 + 3 화면이 세로 스택 (각 스크린 아래에 해당 캡션). CTA는 유지.

### 4.7 FAQ

**방향:** 편집지 톤 아코디언 (박스 없음, 헤어라인만).

**컴포지션**
- 상단 2열: 좌 `07 · FAQ` + "자주 받는 질문." (48px) / 우 "그 외 궁금한 점은 바로 연락주세요. 답변은 1 영업일 안에."
- 5 질문, 각각 `padding 32px 0`, 헤어라인 디바이더
- 각 항목: `[48px 인덱스 01–05] [질문 24px] [+/− 인디케이터]`
- 질문02 (기간) 답변 내부에 정보 요약 미니 블록: `WEB 2~4주 / WEBAPP 6~10주 / DESKTOP · SAAS 12~20주`
- 하단 앵커: "이 외의 질문은 따로 받습니다. → 문의하기 ↓"

**아코디언 동작**
- 한 번에 하나만 열림 (다른 열리면 이전 것은 부드럽게 닫힘)
- 열릴 때:
  - 질문 아래 1px 언더라인 `scaleX: 0 → 1` draw (0.4s, ease-expo)
  - 답변 `max-height + opacity` 슬라이드 인 (0.35s, ease-detail)
  - `+` → `−` 회전 (0.25s)
- 스크롤 진입 시 전체 리스트 0.05s 간격 stagger 페이드업

**데이터 소스**
- `src/data/faq.ts` 그대로 사용 + 질문02 답변에 요약 블록 추가 메타(선택적)

### 4.8 Contact

**방향:** 80px 대형 초대 카피 + 좌 Direct 채널 + 우 미니 폼.

**상단**
- Eyebrow: `08 · CONTACT`
- 헤드라인(80px, weight 600, line-height 0.98): "프로젝트 이야기하러 [오세요.]" (오세요 opacity 0.35)
- 서브카피(16px): "작은 프로젝트도, 큰 프로젝트도 환영합니다. 첫 답변은 평일 기준 24시간 안에."

**좌측 Direct 채널 (헤어라인 리스트, 각 `padding 20px 0`)**
- `EMAIL` — `hello@taktonlabs.com` (26px 링크, 밑줄) + "가볍게 안부, 질문 환영"
- `PHONE · KAKAO` — `010-0000-0000` (20px) + "카카오톡 채널 @taktonlabs"
- `OFFICE` — 주소 2줄 + "양산·부산·경남은 대면 미팅 가능"
- `RESPONSE` — `24h` (32px, weight 600, tabular-nums) + "평일 기준 첫 답변"

**우측 폼 (박스·border-radius 14px 유지)**
- FORM 모노 eyebrow + "정식 문의 — 프로젝트 내용을 자세히." (22px)
- 필드:
  - `NAME · 담당자` (밑줄 스타일 input)
  - `COMPANY` + `EMAIL *` (2열 밑줄)
  - `PROJECT TYPE` pill 4개 선택 (웹·모바일 / 데스크톱 앱 / B2B 맞춤 / 기타)
  - `MESSAGE *` (박스 border, min-height 100px)
- 제출: "보내기 →" pill 버튼 + 좌측에 "개인정보는 문의 응대 목적으로만 사용."

**모션**
- 초대 카피 단어별 0.06s stagger 페이드업
- 좌측 리스트 0.1s 간격 stagger
- 우측 폼 0.2s 딜레이 후 블록 단위 페이드업

### 4.9 Footer

**방향:** B — 3칼럼 링크 + 법적 정보 한 줄. 대형 워드마크 없음.

**상단 3칼럼 (`padding-bottom: 40px`, 하단 헤어라인)**
- `PRODUCTS · 제품`
  - TutorMate (기본 버전)
  - TutorMate **Q** (Q 버전, Q 글자 `#0055cc`)
- `SITE · 바로가기`
  - 핵심 역량, 제품, 문의하기, 이용약관, 개인정보처리방침
- `CONTACT · 연락`
  - GENERAL / SUPPORT / KAKAO 3종, 각각 모노 라벨 + 밑줄 링크

**법적 정보 한 줄 (모노스페이스, 11px, opacity 0.6)**
```
텍톤랩스 · 대표 김상철 · 사업자등록번호 325-10-03297 · 경남 양산시 하북면 신평로 18, 1층
```

**최하단 (헤어라인 상단, 11px, opacity 0.5)**
- 좌: `© 2026 Takton Labs. All rights reserved.`
- 우: `제품을 만듭니다. 끝까지.` · `EST. 2024` (모노)

---

## 5. 기술 스택 (유지)

- Astro 6, Tailwind v4
- GSAP + ScrollTrigger (pin/scrub은 Capabilities·Products 2곳만)
- Lenis smooth scroll
- astro-icon (lucide 아이콘은 최소화 — 편집 디자인 톤에서는 대부분 제거)

---

## 6. 기존 자산 처리

**유지**
- 모든 `src/data/*.ts` (capabilities, process, why, faq, tutomate, philosophy)
- SEO 메타데이터·JSON-LD (Base.astro)
- 폰트 프리로드 (Pretendard, Geist)
- 스킵 링크·접근성 기본
- Lenis·ScrollAnimations·FAQ·Interactive 스크립트 (재작성 또는 리팩터)

**제거**
- Hero 글로우 오브 3종 + 플로팅 로고 애니메이션 + 헤드라인 shimmer
- Philosophy 카드형 레이아웃 → 풀폭 선언문
- Capabilities 아이콘 카드 → morph 카드
- Process 가로 스크롤 트랙
- Why 아이콘 카드 → 헤어라인 그리드
- Products 민트 라인·NoiseOverlay (재검토 — grain은 선택적 유지 가능)
- Footer 대형 wordmark (이 방향에서는 안 씀)

**리팩터 또는 선택 제거**
- **CustomCursor**: 제거. Apple-like 차분한 톤에 자기 주장 강한 커스텀 커서는 방해가 된다. 기본 OS 커서로 복귀.
- **NoiseOverlay**: Products 다크 섹션에만 **약한 grain**(opacity 3%) 적용으로 축소. 나머지 섹션에선 제거.
- **ScrollProgress**: 섹션별 3-segment hairline progress bar(Capabilities·Products)로 대체되므로 전역 스크롤 프로그레스는 제거.

---

## 7. 반응형 전략

| 뷰포트 | 전략 |
|---|---|
| ≥1536 | 기본 디자인 + 섹션 패딩 확대 (`160px`) |
| 1200 – 1535 | 기본 디자인 |
| 768 – 1199 | 대형 타이포 축소 (72px → 56px, 160px → 110px), 다단 그리드는 유지 |
| ≤768 | 모든 pin 해제, 세로 스택, 타이포 추가 축소, 좌우 패딩 `20px` |

핵심: 모바일에선 **pin·scrub 완전 제거**, 컨텐츠는 일반 스크롤로 자연 노출.

---

## 8. 접근성

- `prefers-reduced-motion: reduce`: 모든 pin/scrub 비활성, 최종 상태 즉시 렌더
- `aria-labelledby` 섹션별 유지, 포커스 오더 DOM 순서와 동기
- 아코디언: 키보드 조작(Space/Enter 토글), `aria-expanded`, `aria-controls`
- 대비비: `#0a0a0a` on `#fafaf7` = 약 16:1 (WCAG AAA 통과), `#fafaf7` on `#0a0a0a` 동일
- 카카오 채널·전화번호는 `tel:`/`mailto:` 스킴 필수

---

## 9. 스코프 외 (이 리디자인에서 다루지 않음)

- `/tutomate` 제품 상세 페이지 — 추후 별도 작업
- `/privacy`, `/terms` 법적 페이지 — 톤 통일만 필요 시 추후
- 이메일 서버·폼 백엔드 — 기존 유지
- 국어 외 다국어 — 스코프 밖
