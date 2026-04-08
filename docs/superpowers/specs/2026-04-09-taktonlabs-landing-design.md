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

### 3.0. 디자인 철학 (최상위 원칙)

이 페이지는 세 가지 축을 동시에 만족해야 한다. 모든 컴포넌트/애니메이션/여백은 세 축에 비추어 검증한다.

#### 고급 (Premium) — 덜어내는 미학
- **Restraint** — 페이지 페인트 면적의 95% 이상이 네이비/그레이 계열. 액센트(틸/민트)는 CTA와 핵심 강조에만 사용.
- **오프화이트** — 순백 `#ffffff` 사용 금지 (카드만 예외적으로 허용). 기본 배경은 `#fafaf9` (웜 오프화이트).
- **그레인/노이즈** — 다크 블록에 SVG noise filter 오버레이, 2~3% 불투명도. "손으로 만든" 질감 부여.
- **타이포 정밀** — letter-spacing 크기별 튜닝. `font-feature-settings: 'ss01', 'cv11', 'tnum'`. 숫자는 tabular-nums.
- **보더 라디우스 스케일 (4단계 강제):** `4px` / `8px` / `14px` / `24px`. 임의 값 사용 금지.
- **간격 스케일 (8px 그리드):** `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 · 192`. 홀수/임의 간격 금지.
- **섹션 세로 패딩:** 모바일 72px / 태블릿 96px / 데스크톱 120px / 2xl 160px / 3xl·4xl 192px.
- **이모지 금지** — 본문 및 UI에서 이모지 사용 안 함.

#### 부드러움 (Smoothness) — 콘텐츠는 나타나지 않고 흐른다
- **통합 이징 토큰 (CSS 변수로 정의, 예외 금지):**
  - `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` — 모든 진입 애니메이션
  - `--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)` — 상태 전환 (hover, focus)
  - `--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)` — 스크롤 연동 슬로우 모션
- **GSAP 전역 기본값:** `gsap.defaults({ ease: "power3.out", duration: 0.8 })`
- **최소 duration 0.5s** — 짧은 애니메이션 (< 0.3s) 금지. 모든 움직임은 음미할 수 있어야 함.
- **Lenis 튜닝:** `{ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) }` (3차 감속)
- **GPU 강제** — 모든 `transform` 은 `translate3d()` / `scale3d()`. `will-change` 사전 선언 (단, 사용 후 해제).
- **`top` / `left` / `margin` 애니메이션 금지** — 움직이는 요소는 `transform` 과 `opacity` 만.
- **표준 등장 패턴:** `opacity: 0` + `translateY: 16px` → `opacity: 1` + `translateY: 0`, duration 0.8s, stagger 80ms, ease-out.
- **Reduced motion 폴백** — 완전 비활성이 아닌 **단축**: duration 0, 레이아웃 및 opacity는 유지. 콘텐츠 순간 이동이 아닌 "이미 도착한" 상태로 표시.

#### 신뢰 (Trust) — 픽셀 하나까지 정밀하게
- **8px 그리드 강제** — 모든 간격/크기는 8의 배수. 홀수 px 간격 금지.
- **Weight 4단계만:** 400 (본문) / 600 (강조) / 800 (섹션 제목) / 900 (히어로). 임의 500·700 금지.
- **베이스라인 정렬** — 나란한 카드/컬럼 내부 텍스트는 동일 baseline. 높이가 다른 카드는 컬럼 기준선 맞춤.
- **디테일 시그널:**
  - 스티키 Nav 하단에 1px 가로 그라디언트 라인 (`linear-gradient(90deg, transparent, rgba(10,25,41,0.1), transparent)`)
  - 다크 블록 상단에 민트 그라디언트 라인 (`linear-gradient(90deg, transparent, rgba(94,234,212,0.4), transparent)`)
  - 버튼 hover 시 그림자 상승 (`0 4px 12px rgba(10,25,41,0.12) → 0 8px 24px rgba(10,25,41,0.2)`, 0.3s `--ease-in-out`)
  - 폼 focus 시 0.4s 소프트 링 (`box-shadow: 0 0 0 4px rgba(8,145,178,0.12)`)
  - 카드 hover 시 1px 보더 컬러 시프트 (`#e7e5e4 → #0891b2`, 0.4s)
- **풋터에 법인 정보 placeholder** — 추후 사업자 등록번호/주소 기재 자리 확보 (법적 시그널 = 신뢰).
- **폰트 렌더링 최적화** — `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`.

### 3.1. 기본 톤
- **Clean / Light** 베이스 (웜 오프화이트 배경, 네이비 텍스트)
- **제품 섹션만 다크 블록** 으로 극적 대비 — 라이트→다크 전환이 페이지의 클라이맥스 역할
- 로고의 네이비/틸 그라디언트 팔레트 확장

### 3.2. 컬러 팔레트

디자인 철학 "오프화이트" 원칙에 따라 순백·순검정 금지. 모든 값은 미세한 웜/쿨 편향을 가진다.

| 역할 | 값 | 비고 |
|---|---|---|
| 배경 (기본) | `#fafaf9` | 웜 오프화이트 |
| 배경 (section alt) | `#f5f5f4` | 미세 그레이 웜 (역량/문의 섹션 교차) |
| 배경 (카드) | `#ffffff` | 카드만 순백으로 살짝 떠오르는 효과 |
| 배경 (다크 블록) | `linear-gradient(180deg, #0a1929 0%, #0f2340 100%)` | + SVG noise 2% 오버레이 |
| 텍스트 (primary) | `#0a1929` | Navy, 순검정 금지 |
| 텍스트 (secondary) | `#57606a` | Cool gray, 절제된 대비 |
| 텍스트 (tertiary) | `#8b949e` | 라벨/메타 정보 |
| 액센트 (라이트) | `#0891b2` | Teal, CTA·링크 전용 |
| 액센트 (다크) | `#5eead4` | Mint, 다크 블록 전용 |
| 테두리 (soft) | `#e7e5e4` | 웜 톤, 기본 카드 경계 |
| 테두리 (solid) | `#d6d3d1` | 포커스/hover 전환 대상 |

### 3.3. 타이포그래피
- **한국어:** Pretendard Variable (웹폰트, 한국어 서브셋)
- **라틴:** Inter Variable (OpenType features: `ss01`, `cv11`, `tnum`)
- **Weight 스케일 (4단계 강제):** 400 (본문) / 600 (강조) / 800 (섹션 제목) / 900 (히어로)
- **히어로 헤드라인:** `clamp(34px, 7vw, 84px)` / weight 900 / letter-spacing `-0.03em`
- **섹션 제목:** `clamp(24px, 4vw, 42px)` / weight 800 / letter-spacing `-0.02em`
- **부제/서브카피:** `clamp(15px, 1.3vw, 19px)` / weight 400 / letter-spacing `-0.005em`
- **본문:** `clamp(15px, 1.1vw, 17px)` / weight 400 / line-height `1.75`
- **라벨 (UPPERCASE):** `11px` / weight 700 / letter-spacing `0.15em`
- **전역 폰트 설정:** `font-feature-settings: 'ss01', 'cv11', 'tnum'`
- **숫자:** `font-variant-numeric: tabular-nums` (대시보드/통계 표시 시)

### 3.4. 아이콘
- **Lucide Icons** via `astro-icon` 인티그레이션
- 스트로크 두께 **1.75px 고정** (Lucide 기본 2px보다 가늘게 — 프리미엄 감각)
- 커스텀 SVG는 히어로 헥사곤만 (로고 모티프 확장)

### 3.5. 텍스처
- 다크 블록(제품 섹션)에 SVG `feTurbulence` + `feColorMatrix` 기반 노이즈 오버레이
- 불투명도 2~3%, 라이트 모드 섹션에는 적용 안 함 (라이트는 순수 + 카드로 입체감)

## 4. 페이지 구조

### 4.1. Navigation
- 스티키 상단, 블러 backdrop (`backdrop-filter: blur(14px)`, 배경 `rgba(250,250,249,0.8)`)
- 좌측: 헥사곤 로고 (28×28) + "TAKTONLABS" 워드마크 (weight 800, letter-spacing 0.5px)
- 우측 (데스크톱): 앵커 링크 "역량 · 제품 · 문의" — 간격 32px, hover 시 색상 secondary → primary (0.3s `--ease-in-out`)
- 우측 (모바일): 링크 3개를 그대로 노출 (햄버거 불필요 — 항목이 적음). 글자 크기만 축소.
- 하단에 **1px 가로 그라디언트 라인** (신뢰 디테일) — `linear-gradient(90deg, transparent, rgba(10,25,41,0.1), transparent)`
- 클릭 시 앵커로 스무스 스크롤 (Lenis 사용)

### 4.2. Hero
- **헤드라인:** "제품을 만듭니다. 끝까지." — weight 900, letter-spacing `-0.03em`, line-height 1.1
- **서브카피:** "웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오." — weight 400, max-width 560px
- **Primary CTA:** "제품 둘러보기 →" (→ `#products`) — 네이비 배경, 민트 hover 시 그림자 상승
- **Secondary CTA:** "문의하기" (→ `#contact`) — 투명 배경, 웜 그레이 테두리
- **비주얼:** 우측 (데스크톱) / 상단 (모바일) 에 커스텀 3D 헥사곤 로고. 네이비/틸 그라디언트, 내부 상승 화살표. 아주 미세한 그림자 (`0 40px 80px rgba(10,25,41,0.12)`).
- **배경:** `#fafaf9` 웜 오프화이트 + 좌상단에서 우하단으로 이어지는 아주 미세한 그라디언트 메시 (`radial-gradient` 2개 겹침, 5% 불투명도) — 감지 안 될 정도로 미묘한 깊이감

**인터랙션 (부드러움 축):**
- 헤드라인 **단어 단위** 페이드인 + `translateY(16px → 0)` (stagger 80ms, duration 0.9s, ease-out)
- 서브카피는 헤드라인 완료 후 0.2s 딜레이로 등장
- CTA 2개는 서브카피 완료 후 순차 등장 (stagger 120ms)
- 헥사곤: 전체 등장은 0.1s → 1.2s 스케일 1.2→1 + 페이드 (ease-smooth), 이후 마우스 패럴럭스 활성화
- 헥사곤 마우스 패럴럭스: `rotateY(-8deg~+8deg)` `rotateX(-5deg~+5deg)`, 부드러운 lerp 보간 (데스크톱 only)
- 스크롤 진행도 0~25% 구간에서 헥사곤이 미세하게 축소·페이드하며 다음 섹션에 자리를 양보

**모바일:**
- 헥사곤이 헤드라인 위로 이동 (세로 스택), 크기 `100px`
- 마우스 패럴럭스 비활성 (진입 애니메이션만 유지)

### 4.3. 핵심 역량 (Capabilities)
- **배경:** `#f5f5f4` (웜 그레이, section alt)
- **제목:** "세 가지 영역에서 끝까지 만듭니다" — weight 800, letter-spacing `-0.02em`
- **서브카피:** (선택) "하나를 만들어도 처음부터 끝까지 직접 합니다."
- **3개 카드** (gap 24px, 가로 그리드 — 데스크톱 / 세로 스택 — 모바일):
  - 카드 스타일: `#ffffff` 배경, radius 14px, 1px 테두리 `#e7e5e4`, 패딩 32px, 미세 그림자 `0 1px 2px rgba(10,25,41,0.04)`
  - 카드 내부: Lucide 아이콘 (40px) → 제목 (weight 800) → 설명 (weight 400)
  1. **웹·모바일 제품** (Lucide `layout-grid`) — "SaaS, 웹앱, 반응형 사이트. 기획 · 디자인 · 개발 · 배포"
  2. **데스크톱 앱** (Lucide `app-window`) — "Electron 기반 크로스플랫폼. 자동 업데이트 · 코드 사이닝 · 배포까지"
  3. **B2B 맞춤 개발** (Lucide `blocks`) — "업무 흐름을 이해하고 거기에 맞는 도구를 만듭니다"

**인터랙션 (데스크톱 `lg+`, 부드러움 축):**
- 섹션이 뷰포트에 **pin** 됨 (ScrollTrigger `pin: true`, 총 스크롤 거리 `200vh`)
- 스크롤 진행에 따라 3개 카드가 순차적으로 "active" 상태 전환:
  - 테두리 컬러 `#e7e5e4 → #0891b2` (0.4s ease-in-out)
  - 그림자 상승 `0 1px 2px → 0 20px 48px rgba(10,25,41,0.12)` (0.6s ease-smooth)
  - 미세 스케일 `scale(1) → scale(1.02)` (0.6s ease-smooth)
  - 아이콘 배경 컬러 라이트틸 → 틸 활성
- 동시에 다른 카드는 `opacity: 0.4` 로 물러남 (0.4s ease-in-out)
- 섹션 스크롤 완료 후 unpin, 모든 카드 정상 상태 복귀

**모바일 (base ~ md):**
- **Pin 비활성** — 일반 스크롤
- 카드가 뷰포트 진입 시 각자 페이드인 + `translateY(24px → 0)` (IntersectionObserver, ease-out, duration 0.8s)
- 한 카드씩 세로로 크게 표시 (패딩 확장)

### 4.4. 제품 (Products) — Dark Block
- **배경:** 다크 그라디언트 `linear-gradient(180deg, #0a1929 0%, #0f2340 100%)`
- **노이즈 오버레이:** SVG `feTurbulence` 기반 필터, 2~3% 불투명도. "손으로 만든" 질감 → 고급 축 핵심 디테일
- **상단 1px 그라디언트 라인:** `linear-gradient(90deg, transparent, rgba(94,234,212,0.4), transparent)` — 다크 블록 진입 신호 (신뢰 디테일)
- **제목:** "이론이 아닙니다. 실제로 만들고 운영합니다." — weight 800, letter-spacing `-0.02em`
- **서브카피:** "현재 출시 · 운영 중인 제품"
- **TutorMate 카드** (좌: 정보, 우: 앱 윈도우 목업):
  - "주력 제품" 라벨 (민트, UPPERCASE, letter-spacing 0.15em, 11px)
  - 제품명: TutorMate (weight 900, 28px)
  - 설명: "60대 이상 강사의 수강 관리를 쉽게. 수강생 · 결제 · 대시보드까지 직관적으로."
  - 태그: Electron · Win · Mac · 자동 업데이트 (민트 배경, radius 24px 알약 형태)
  - CTA: "자세히 보기 →" — 초기 구현은 `#` 앵커로 처리하고, TutorMate 제품 페이지가 준비되면 URL 연결 (Open Questions 참조)
- **우측 비주얼:** 스타일라이즈된 앱 윈도우 프레임 (radius 14px, 1px 반투명 테두리) + 내부 UI 플레이스홀더 블록

**인터랙션 (가장 강한 임팩트, 부드러움 축):**
- **라이트→다크 전환**: 이전 섹션(역량) 끝 25% ~ 이 섹션 시작 지점에서 **body 배경색이 긴 호흡으로 페이드** (1.2s, ease-smooth). 갑작스러운 컷 없음.
- **상단 민트 그라디언트 라인 draw-in** — 다크 진입 시 좌→우 0.8s 동안 선이 그어지며 "입장"
- TutorMate 앱 윈도우가 뷰포트 진입 시 "열리며" 내부 UI 요소들이 stagger 등장:
  1. 창 프레임 scale 0.95 → 1 + 페이드 (0.8s)
  2. 창 헤더 dots 등장 (stagger 60ms)
  3. 본문 블록 stagger 80ms
  4. 카드 stagger 100ms
- 태그 칩은 한 개씩 `scale(0.8) → 1` pop-in (stagger 60ms, ease-out)
- 모든 등장은 통합 이징 `--ease-out` 사용

**모바일:**
- 좌우 2열 → 세로 1열 스택 (정보 상단, 윈도우 목업 하단)
- 드라마틱한 배경 전환은 유지 (성능 비용 낮음)
- 윈도우 UI stagger 등장은 단계 축소 (3단계 → 1단계, 전체 페이드인으로 통합)

### 4.5. 문의 (Contact)
- **배경:** 다시 `#fafaf9` 라이트로 복귀 (다크→라이트 전환, body 배경 1.2s ease-smooth 페이드)
- **제목:** "프로젝트 이야기하러 오세요" — weight 800, letter-spacing `-0.02em`
- **서브카피:** "작은 프로젝트도, 큰 프로젝트도 환영합니다."
- **2개 카드** (gap 24px, 데스크톱 가로 / 모바일 세로):
  1. **이메일 카드** — `#ffffff` 배경, 1px 테두리 `#e7e5e4`, radius 14px, 패딩 32px. Lucide `mail` 아이콘 (32px, 네이비) + `hello@taktonlabs.com` (weight 800) + "가볍게 안부, 질문 환영" (secondary gray). `mailto:` 링크. Hover 시 테두리 컬러 시프트 + 미세 그림자 상승.
  2. **문의 폼 카드** — 네이비 배경 `#0a1929` + 민트 액센트 `#5eead4`, radius 14px, 패딩 32px. Lucide `send` 아이콘 (민트). **항상 인라인 폼** (모달 없음). 데스크톱에서도 카드 클릭 시 카드 내부에 폼이 펼쳐짐 (height 자동 확장, 0.6s ease-smooth).
- **폼 필드 레이아웃:** 이름 + 이메일 (2열) / 회사명 + 예산 범위 (2열, 선택) / 프로젝트 내용 (1열, textarea) / 제출 버튼 (민트, weight 700).
- **폼 필드:** 이름 (필수), 이메일 (필수), 프로젝트 내용 (필수), 회사명 (선택), 예산 범위 (선택)
- **Input 스타일:** 투명 배경 + 하단 1px 보더 `rgba(255,255,255,0.2)`. Focus 시 보더 민트로 시프트 + **소프트 링** `box-shadow: 0 0 0 4px rgba(94,234,212,0.15)` (0.4s ease-in-out, 신뢰 디테일).
- **제출:** Web3Forms API. 제출 후 폼 자리에 성공 애니메이션 인라인 표시 — 체크마크 SVG `stroke-dasharray` draw-in (0.8s ease-out) + "연락드리겠습니다" 카피 페이드인.

**모바일:**
- 2열 → 1열 스택 (이메일 카드 위, 폼 카드 아래)
- 폼 카드는 모바일에서 항상 펼쳐진 상태 (토글 없음 — 2단계 터치 부담 제거)
- 폼 필드는 세로 1열 스택

### 4.6. Footer
- 배경 `#f5f5f4` (section alt, 문의 섹션과 미세 구분)
- 상단 1px 테두리 `#e7e5e4`
- 패딩 세로 48px, 가로 `max-content-width` 적용
- 좌측 상단: 헥사곤 로고 미니 (20px) + "TAKTONLABS" 워드마크 + 한 줄 미션 ("쓰이는 소프트웨어를 끝까지 만듭니다")
- 우측: `hello@taktonlabs.com` / `taktonlabs.com`
- 하단 바: © 2026 Taktonlabs · 사업자 정보 placeholder (추후 사업자 등록번호/대표자/주소 표기 자리 — **법적/신뢰 시그널**)
- 미니멀. 소셜 링크 없음. 과잉 링크 없음.

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
│   │   └── Base.astro              # HTML shell, meta, 폰트 preload, 글로벌 스타일 import
│   ├── pages/
│   │   └── index.astro             # 섹션 조합, JSON-LD, SEO 메타
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── HexagonLogo.astro       # 3D 헥사곤 (커스텀 SVG + CSS 3D)
│   │   ├── Capabilities.astro
│   │   ├── CapabilityCard.astro
│   │   ├── Products.astro
│   │   ├── ProductCard.astro
│   │   ├── TutorMateWindow.astro   # 스타일라이즈 앱 윈도우 목업
│   │   ├── Contact.astro
│   │   ├── ContactForm.astro
│   │   ├── Footer.astro
│   │   └── NoiseOverlay.astro      # SVG feTurbulence 노이즈 필터 (다크 블록용)
│   ├── scripts/
│   │   ├── scroll-animations.ts    # GSAP ScrollTrigger 타임라인, 전역 defaults
│   │   ├── smooth-scroll.ts        # Lenis 초기화 (튜닝 값 적용)
│   │   ├── hexagon-interactive.ts  # 히어로 헥사곤 마우스 패럴럭스 (lerp 보간)
│   │   └── motion-guards.ts        # prefers-reduced-motion 체크 & 폴백
│   └── styles/
│       ├── global.css              # Tailwind import, 전역 폰트 설정, 리셋
│       └── tokens.css              # 디자인 토큰: 컬러/간격/radius/이징/브레이크포인트 (Tailwind @theme)
├── public/
│   ├── favicon.svg                 # 헥사곤 로고 (네이비/틸 그라디언트)
│   ├── og-image.png                # 소셜 공유용 1200×630
│   └── fonts/                      # Pretendard Variable, Inter Variable (self-hosted)
├── astro.config.mjs                # astro-icon, tailwind 통합, sitemap
├── package.json
└── wrangler.toml                   # Cloudflare Pages 설정 (선택)
```

## 7. 반응형 전략 (모바일 ↔ 4K)

360px 모바일부터 3840px 4K 모니터까지 전 구간에서 의도된 경험을 제공한다. Tailwind 기본값을 확장해 7단계 브레이크포인트를 사용한다.

### 7.1. 브레이크포인트

| 토큰 | 최소 너비 | 대상 디바이스 |
|---|---|---|
| `(base)` | 0 | 기본 (360px~) 작은 모바일 |
| `sm` | 640px | 큰 모바일 / 모바일 가로 |
| `md` | 768px | 태블릿 세로 |
| `lg` | 1024px | 태블릿 가로 / 소형 노트북 |
| `xl` | 1280px | 일반 노트북 / 데스크톱 |
| `2xl` | 1536px | 와이드 데스크톱 (MBP 16") |
| `3xl` | 1920px | FHD 풀스크린 / iMac 24" |
| `4xl` | 2560px | QHD / 4K 다운스케일 (27"+ 모니터, 5K MBP) |

Tailwind v4 설정에서 `@theme` 블록에 커스텀 screens 정의:
```
@theme {
  --breakpoint-2xl: 1536px;
  --breakpoint-3xl: 1920px;
  --breakpoint-4xl: 2560px;
}
```

### 7.2. 최대 콘텐츠 폭 (Max Content Width)

4K 모니터에서 콘텐츠가 뷰포트 끝까지 퍼져 "허전한 와이드 스크린"이 되지 않도록 중앙 프레임을 둔다.

| 영역 | max-width | 원리 |
|---|---|---|
| 전체 섹션 컨테이너 | `1440px` | 히어로·역량·제품·문의 공통 |
| 본문 텍스트 블록 | `720px` (65ch) | 가독성 최적 행 길이 |
| 카드 그리드 래퍼 | `1280px` | 3열 카드 기준 여유 확보 |
| 풀블리드 배경 | `100vw` | 배경 컬러/그라디언트는 끝까지, 콘텐츠만 중앙 |

### 7.3. 모바일 우선 원칙 (base ~ lg)
1. **Pin 섹션 비활성** — 역량 섹션 pinning은 `lg` 이상에서만 활성. 모바일은 자연 스크롤 + IntersectionObserver 기반 진입 애니메이션.
2. **마우스 패럴럭스 / 호버 효과 비활성** — `@media (hover: hover) and (pointer: fine)` 로 가드.
3. **레이아웃 전환** — 모든 가로 그리드는 모바일에서 세로 스택.
4. **타이포 스케일링** — 모든 제목은 `clamp()` 기반. 직접 미디어쿼리 분기 최소화.
5. **애니메이션 시퀀스 단축** — 모바일에서 stagger 단계 축소 (예: 5개 → 3개), duration 20~30% 단축.
6. **이미지 사이즈** — AVIF/WebP + 뷰포트 기반 `srcset`, 모바일은 1x/2x 해상도까지만.
7. **터치 타겟** — 최소 44×44px 확보.

### 7.4. 대형 화면 전략 (2xl ~ 4xl)

단순히 콘텐츠를 "더 크게" 늘리는 것이 아니라, **의도된 프레임**으로 유지한다.

1. **중앙 정렬 우선** — 콘텐츠는 `max-width: 1440px` 중앙 정렬. 양옆에 의도된 여백 생성.
2. **세로 패딩 단계 확장** — 섹션 패딩 2xl 160px / 3xl·4xl 192px.
3. **타이포 최대값 자동 확장** — `clamp()` 의 max 값이 자동으로 적용. 히어로 헤드라인 최대 84px까지.
4. **히어로 헥사곤 확장** — 140px → 220px (xl) → 280px (2xl) → 360px (3xl/4xl). 여전히 텍스트를 압도하지 않음.
5. **카드 그리드 — 3열 유지** — 4K라고 4열/5열로 늘리지 않음. gap만 확장 (24px → 32px → 48px).
6. **배경 풀블리드** — 배경색/그라디언트는 뷰포트 끝까지, 콘텐츠만 중앙. 다크 블록 전환이 4K에서도 동일한 드라마.
7. **이미지 해상도** — `srcset` 에 3x(4K 대응) 포함.
8. **Lenis 스크롤 동작은 동일** — 큰 화면일수록 스크롤 거리가 길어지므로, 섹션 간 진입 속도를 자연스럽게 유지.

### 7.5. 접근성 (Accessibility)
- **`prefers-reduced-motion: reduce`** → 모든 ScrollTrigger/GSAP 애니메이션을 즉시 완료 상태로 표시 (duration 0). 레이아웃은 유지하고 이동/페이드만 생략. Lenis 비활성 → 네이티브 스크롤.
- **포커스 표시** — 모든 인터랙티브 요소에 명확한 포커스 링 (디자인 철학의 "0.4s 소프트 링" 규칙 준수).
- **의미 있는 `alt`** — 모든 이미지/아이콘에 alt. 데코레이션은 `aria-hidden="true"`.
- **키보드 전 흐름** — Tab으로 Nav → Hero CTAs → 역량 카드 → 제품 CTA → 문의 폼 순으로 논리적 이동.
- **최소 명도비 4.5:1 (WCAG AA)** — 다크 블록의 mint 텍스트 / 라이트 모드의 secondary gray 검증 필요.
- **폼** — 모든 input에 `<label>`, 에러 메시지 `aria-live="polite"`, 필수 필드 `aria-required`.
- **스킵 링크** — 페이지 최상단에 "본문으로 건너뛰기" (키보드 포커스 시에만 표시).

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

1. **디자인 토큰 정의** — `src/styles/tokens.css` 에 컬러/간격/radius/이징/브레이크포인트 전체 정의 (Tailwind v4 `@theme`). 전역 폰트 설정 포함.
2. **기본 인프라 세팅** — Astro 설정, Tailwind v4, astro-icon + Lucide, Pretendard/Inter self-host, 사이트맵 인티그레이션
3. **레이아웃 + Nav + Footer** — Base.astro (메타/폰트 preload), Nav (블러 backdrop + 그라디언트 라인), Footer (법인 정보 placeholder)
4. **정적 마크업 전 섹션** — Hero, Capabilities, Products, Contact를 애니메이션 없이 마크업/스타일만 완성 (디자인 토큰만으로)
5. **반응형 검증 (모바일 → 4K)** — 360 / 640 / 768 / 1024 / 1280 / 1536 / 1920 / 2560px 전 구간 시각적 점검
6. **문의 폼 제출** — Web3Forms 연동, 유효성 검사, 에러/성공 인라인 상태, 소프트 포커스 링
7. **기본 인터랙션 레이어** — Lenis 스무스 스크롤 튜닝, GSAP 전역 defaults, 통합 이징 토큰 적용, 진입 페이드/슬라이드
8. **Hero 헥사곤 3D 인터랙티브** — 커스텀 SVG + CSS 3D, 마우스 패럴럭스 (lerp 보간), 스크롤 연동 축소·페이드
9. **핀 섹션 (역량)** — ScrollTrigger pin, 카드 순차 활성화 (데스크톱 전용), 모바일은 IntersectionObserver 진입
10. **제품 섹션 클라이맥스** — 라이트→다크 body 배경 전환, 민트 라인 draw-in, 노이즈 오버레이, 앱 윈도우 stagger reveal
11. **디테일 레이어** — 버튼 hover 그림자 상승, 포커스 링, 카드 테두리 시프트, 태그 칩 pop-in
12. **접근성 패스** — `prefers-reduced-motion` 폴백 (비활성 아닌 단축), 포커스, alt, axe-core, 키보드 순서 검증
13. **성능 패스** — Lighthouse 감사 (4개 카테고리 90+), 번들 사이즈 점검, 폰트 preload 확인, GSAP lazy init
14. **크로스 브라우저 + 대형 화면** — Chrome·Safari·Firefox·Edge + 4K 모니터 실기기 확인
15. **배포** — Cloudflare Pages 프로젝트 생성, 환경 변수, 커스텀 도메인 연결, Email Routing 활성화
