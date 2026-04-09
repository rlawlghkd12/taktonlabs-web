# Taktonlabs 랜딩 리디자인 v2 — 콘텐츠·타이포·SEO 보강 스펙

**작성일:** 2026-04-10
**상태:** 디자인 확정, 구현 대기
**관련 문서:** `docs/superpowers/specs/2026-04-09-taktonlabs-landing-design.md` (v1)

---

## 1. 컨텍스트

### 왜 지금 이 작업이 필요한가

v1 랜딩페이지는 "3초 안에 뭐하는 회사인지 이해시킨다"는 원칙으로 미니멀하게 만들어졌다. 실제 구축 후 사용자(@kjh) 검토 결과:

- **절대적인 콘텐츠 부족** — 스크롤 분량이 짧고, 각 섹션의 카피가 헤드라인 + 한 문장 수준이라 "밀도" 부족
- **"있어보이는" 느낌 부족** — 프리미엄 SaaS 랜딩(Apple 프로덕트 페이지 등)은 스크롤마다 새로운 시각·카피 모멘트가 있어 체류 시간과 신뢰감을 높이는데, 현 v1은 스크롤 거리가 짧음
- **타이포그래피 개성 부족** — Inter 는 "모든 사이트"와 비슷한 느낌. Takton Labs 브랜드 각인 약함
- **SEO 약점** — 본문 콘텐츠 절대량이 적어서 검색 키워드 매칭 기회 제한

### 성공 기준

v2 작업 완료 후:

1. 스크롤 횟수가 4~5회 → 6~8회로 늘어나되 조잡해지지 않음
2. 새 방문객이 "이 회사 꽤 있어보인다" 느낌을 받음 (설득력 있는 카피 다수)
3. 타이포그래피가 일관되면서도 개성 있음
4. Google 검색 결과에서 Organization/Product/Service/FAQ 리치 스니펫 노출 가능성 확보

### 유지되는 원칙

v1의 디자인 철학 (고급 / 부드러움 / 신뢰) 3축은 모두 유지. v2는 그 위에 콘텐츠 레이어를 추가하는 작업이지 재설계가 아님.

---

## 2. 스코프 결정

### In Scope

- **새 섹션 3개 추가:** Philosophy / Process / Why Takton Labs
- **새 섹션 1개 추가:** FAQ (SEO 킬러)
- **기존 섹션 4개 카피 보강:** Hero / Capabilities / Products / Contact
- **타이포 교체:** Latin 디스플레이·본문 → Geist (Pretendard는 한글 그대로 유지)
- **SEO 강화:** 추가 schema.org 마크업 (Product, Service, FAQPage) + h1~h3 시맨틱 + 본문 키워드 밀도
- **새 인터랙션 3개:** Philosophy 스크롤 reveal / Process sticky progress bar / FAQ 부드러운 아코디언
- 기존 Capabilities 카드 하단 기술 태그 추가 (개발자 방문 시 신호)

### Out of Scope (YAGNI)

- 블로그 / 뉴스 섹션
- 숫자·통계 섹션 (출시 1개월 미만이라 숫자 허전)
- 고객사 로고 월 (고객 없음)
- 증언 / 테스티모니얼
- 팀 / 회사 소개 (여전히 공개할 팀 정보 없음)
- 다국어 (한국어 유지)
- 별도 Technology 섹션 (일반 방문객 가치 낮음 — Capabilities 태그로 축소)
- 새 Hero 시각 요소 (헥사곤 로고 변경 등)
- 디자인 토큰 수정 (v1 토큰 그대로 사용)

---

## 3. 신규 섹션 상세 명세

### 3.1. Philosophy · 세 가지 약속 (Section 02, Hero 직후)

**목적:** 브랜드 가이드의 핵심 3가치를 시각화해 "이 회사는 생각이 있는 회사" 신호를 빠르게 전달.

**배경:** `#fafaf9` (기본 라이트), 섹션 상단에 얕은 수평 그라디언트 라인 (신뢰 디테일).

**헤드라인 영역:**
- 라벨: `FILOSOFIA · 세 가지 약속` (UPPERCASE, 틸 액센트, 11px)
- 제목: `빈틈없는 관리의 완성` (clamp(24px, 4vw, 42px), weight 800)
- 서브카피: `우리가 일하는 이유이자 기준입니다.` (clamp(15px, 1.3vw, 19px))

**3 가치 카드** (세로 스택, 데스크톱에서는 가로 그리드):

#### 01 · Reliability · 신뢰성
- **키워드 타이틀:** `튼튼한 장부처럼`
- **본문:** "한 명의 회원도, 한 건의 수납도 놓치지 않습니다. 데이터는 안전하게 보관되고, 언제든 정확히 복원됩니다. 편리함을 위해 신뢰를 타협하지 않습니다."
- **강조 단어:** `장부처럼` (틸 컬러 + stroke draw-in 애니메이션)

#### 02 · Clarity · 명확성
- **키워드 타이틀:** `한눈에 보이는 지표`
- **본문:** "누가 미납했는지, 이번 달 매출은 얼마인지. 복잡한 숫자를 단순한 대시보드로. 판단에 필요한 정보만, 필요한 순간에 드러납니다."
- **강조 단어:** `한눈에` (틸 컬러)

#### 03 · Sustainability · 지속성
- **키워드 타이틀:** `함께 성장하는 파트너`
- **본문:** "일시적인 도구가 아닙니다. 비즈니스가 자라면 소프트웨어도 함께 자라야 합니다. 긴 호흡으로 파트너가 되는 것이 목표입니다."
- **강조 단어:** `파트너` (틸 컬러)

**카드 구조 (각각):**
- 좌측 세로 민트 라인 (border-left 3px)
- 작은 라벨 `01 · RELIABILITY · 신뢰성` (라틴 Geist + 한글 Pretendard 혼용, tertiary color)
- 키워드 타이틀 (Pretendard 800, letter-spacing -0.01em)
- 본문 (Pretendard 400, secondary color, line-height 1.75)

**인터랙션:**
- 뷰포트 진입 시 3 카드가 순차 stagger reveal (translateY 24 → 0, opacity 0 → 1, 100ms stagger)
- 각 카드의 **강조 단어**는 SVG stroke 밑줄이 좌 → 우로 draw-in (300ms delay, 0.6s duration, ease-out)
- 모바일에서는 stagger만, 밑줄 애니메이션은 유지 (간단한 transform)

**반응형:**
- 데스크톱 `lg+`: 3 카드 가로 그리드 (3열)
- 태블릿 `md`: 2 + 1 (마지막 카드 전체 너비)
- 모바일: 세로 스택

---

### 3.2. Process · 어떻게 일하는가 (Section 04, Capabilities 직후)

**목적:** "어떻게 일하는지" 구체적으로 보여줘서 "외주 포비아" 해소. 의사결정자가 "안심하고 맡길 수 있는 회사"로 인식.

**배경:** `#f5f5f4` (section alt).

**헤드라인 영역:**
- 라벨: `PROCESS · 어떻게 일하는가`
- 제목: `4 단계 · 차근차근 · 끝까지`
- 서브카피: `이해 → 설계 → 개발 → 운영. 어느 단계에도 지름길은 없습니다.`

**레이아웃 — Sticky Progress:**
- 데스크톱 `lg+`:
  - 좌측: `sticky` 세로 progress bar (높이 60vh, 단계 01~04 마커) — 스크롤 진행에 따라 마커 이동 + 활성 단계 하이라이트
  - 우측: 4 단계 콘텐츠가 세로로 스크롤 (각 단계 min-height 70vh)
- 모바일 `md 이하`:
  - sticky 제거, 일반 세로 스택
  - 각 단계는 왼쪽에 큰 번호 + 제목/본문

**4 단계 상세:**

#### 01 · Discover · 이해
- **부제:** `문제를 제대로 알기`
- **본문:** "업무 흐름을 함께 걷고, 사용자의 실제 불편을 듣고, 숨겨진 요구사항을 발견합니다. 기술 선택은 그 다음입니다."
- **원칙 3개** (mini bullet):
  - 기존 업무 관찰 (스크린 공유·인터뷰)
  - 진짜 고객(실사용자) 목소리 수집
  - 요구사항 정리 문서로 합의

#### 02 · Design · 설계
- **부제:** `구조가 결과를 결정한다`
- **본문:** "화면보다 먼저 데이터 모델과 API 경계를 잡습니다. 탄탄한 설계가 유지보수 10년의 비용을 결정합니다."
- **원칙 3개:**
  - 데이터 모델 먼저, UI는 그 다음
  - 확장 포인트 미리 설계
  - 실제 사용자와 UI 프로토타입 검증

#### 03 · Build · 개발
- **부제:** `한 번에 올바르게`
- **본문:** "검증된 기술과 모범 사례로 느리지만 확실하게 만듭니다. 테스트 없는 코드는 출시하지 않습니다."
- **원칙 3개:**
  - 매일 빌드 가능한 상태 유지
  - 테스트 커버리지 80% 이상
  - 주 1회 데모 · 고객 피드백 반영

#### 04 · Operate · 운영
- **부제:** `출시는 시작입니다`
- **본문:** "자동 업데이트, 모니터링, 빠른 대응. 문제가 생기기 전에 발견하고, 생겼을 땐 즉시 고칩니다."
- **원칙 3개:**
  - 자동 에러 수집 (Sentry·로그)
  - 정기 백업 + 복구 테스트
  - 긴급 대응 1 영업일 이내

**인터랙션:**
- 좌측 progress bar의 현재 마커가 스크롤 위치에 따라 smooth scroll 이동 (scroll-linked)
- 현재 활성 단계의 번호 글자가 크게 + 틸 컬러로 전환, 비활성은 회색
- 각 단계 원칙 3개는 섹션 진입 시 stagger reveal

---

### 3.3. Why Takton Labs · 왜 우리인가 (Section 05, Process 직후)

**목적:** 외주 경험 있는 사람의 "공포 이슈" 에 선제 답변. 신뢰 쐐기.

**배경:** `#fafaf9` (기본 라이트).

**헤드라인 영역:**
- 라벨: `WHY TAKTON LABS · 왜 우리인가`
- 제목: `네 가지 약속`
- 서브카피: `외주가 무서웠던 분들을 위한 준비된 답변입니다.`

**4 약속 카드** (2×2 그리드 데스크톱 / 세로 스택 모바일):

#### 01 · 만든 사람이 끝까지 함께합니다
- **본문:** "기획한 사람, 설계한 사람, 코드를 짠 사람이 출시 후에도 같은 자리에 있습니다. 인수인계로 생기는 공백이 없습니다. 연락이 끊기는 일도 없습니다."

#### 02 · 데이터는 완전히 당신의 것
- **본문:** "Excel, CSV, SQL 덤프. 언제든 원하는 형식으로 내보낼 수 있습니다. 특정 플랫폼에 잠기지 않도록 설계부터 신경 씁니다."

#### 03 · 숨겨진 비용 없는 유지보수
- **본문:** "월 정액 유지보수 옵션. 작은 수정도, 긴급 장애 대응도 추가 비용 없이. 큰 기능 추가만 별도 견적입니다."

#### 04 · 소스코드 완전 양도
- **본문:** "GitHub 프라이빗 레포 전체를 이관해드립니다. 다른 개발사에 맡기고 싶을 때, 내부 개발팀이 생겼을 때, 자유롭게 선택할 수 있습니다."

**카드 구조 (각각):**
- 숫자 + 제목 (한 줄 대비)
- 본문
- 상단 좌측 작은 아이콘 (`lucide:infinity` / `lucide:unlock` / `lucide:receipt` / `lucide:package`)

**인터랙션:**
- 뷰포트 진입 시 4 카드 stagger reveal
- 호버: 카드 미세 tilt (translate3d 0 -4px) + border 틸 transition + 아이콘 pulse
- 모바일은 진입만, 호버 없음

---

### 3.4. FAQ · 자주 묻는 질문 (Section 07, Products 직후)

**목적:** SEO 킬러. Google FAQ 리치 스니펫 노출. 실용 정보.

**배경:** `#f5f5f4`.

**헤드라인 영역:**
- 라벨: `FAQ · 자주 묻는 질문`
- 제목: `궁금한 건 미리 알려드립니다`
- 서브카피: `연락하기 전에 확인해보세요. 대부분의 질문은 여기서 답을 얻을 수 있습니다.`

**6 질문 아코디언:**

1. **Q. 프로젝트 비용은 어떻게 정해지나요?**
   A. 기능 범위와 일정을 먼저 정리한 뒤 고정가 또는 기간 기반 견적을 드립니다. 소규모 랜딩은 수백만원부터, 중규모 SaaS는 수천만원 수준입니다. 첫 상담과 견적은 무료입니다.

2. **Q. 작업 기간은 보통 얼마나 걸리나요?**
   A. 랜딩·간단한 웹은 2~4주, 중규모 웹앱은 6~10주, 데스크톱 앱이나 복잡한 SaaS는 12~20주가 기준입니다. 시간에 쫓기는 프로젝트는 사전에 공유해주시면 우선 배치합니다.

3. **Q. 출시 후 유지보수는 어떻게 되나요?**
   A. 출시 후 1개월 기본 보증(버그 무료 수정)을 드립니다. 이후에는 월 정액 유지보수 계약을 선택하실 수 있습니다. 긴급 장애는 영업일 24시간 이내 대응합니다.

4. **Q. 기존 시스템이 있으면 마이그레이션 가능한가요?**
   A. 네. 기존 데이터 구조 분석 → 병렬 운영 (새 시스템과 기존 시스템 동시 가동) → 검증 후 전환 순서로 안전하게 진행합니다. 데이터 손실 없이 이전합니다.

5. **Q. 원격으로만 진행되나요?**
   A. 기본은 원격(온라인 미팅·공유 문서·채팅)이지만, 양산·부산·경남 지역은 대면 미팅도 가능합니다. 수도권이나 먼 지역은 프로젝트 규모에 따라 출장이 가능합니다.

6. **Q. 소스코드는 누가 소유하나요?**
   A. 100% 고객사 소유입니다. 프로젝트가 종료되면 GitHub 프라이빗 레포의 소유권을 전체 이관해드립니다. 이후에는 다른 개발사에 맡기거나 내부 팀에서 유지보수하실 수 있습니다.

**인터랙션:**
- 각 질문 클릭 시 아코디언 확장 (`max-height` auto + opacity, 0.4s `ease-out`)
- 활성 상태 표시 (좌측 bar 틸 컬러 + 아이콘 90도 회전)
- **schema.org FAQPage JSON-LD** 를 페이지에 삽입 → Google 리치 스니펫 후보

---

## 4. 기존 섹션 카피 보강

### 4.1. Hero

**현재 서브카피:**
> "웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오."

**신규 서브카피 (3문장으로 확장):**
> "웹·모바일·데스크톱. 설계부터 운영까지 직접 만드는 소프트웨어 스튜디오.
> 한 명의 사용자, 한 건의 데이터까지 놓치지 않는 탄탄한 시스템을 만듭니다.
> 쓰이는 소프트웨어는 **오래 쓰이는 소프트웨어**가 되어야 합니다."

첫 줄은 구체적 사실, 둘째 줄은 강점, 셋째 줄은 철학(오래 쓰이는 = 브랜드 메시지). `**`로 감싼 부분은 틸 컬러 강조.

### 4.2. Capabilities

**변경 1 — 서브카피 추가:**
기존 제목 아래에 "하나를 만들어도 처음부터 끝까지 직접 합니다." 한 문장이 있었는데, 그 아래 **부가 설명 문장** 추가:
> "우리가 선택한 기술은 모두 우리가 직접 쓰는 것들입니다. 자랑이 아니라 책임을 위해서입니다."

**변경 2 — 카드별 설명 확장 (1문장 → 2~3문장):**

**웹·모바일 제품:**
- 기존: "SaaS, 웹앱, 반응형 사이트. 기획 · 디자인 · 개발 · 배포까지 한 팀에서."
- 신규: "SaaS, 웹앱, 반응형 사이트. 기획부터 디자인, 개발, 배포, 그리고 사용자 피드백을 반영한 개선까지. 프로토타입에 머무르지 않는 진짜 운영 가능한 제품을 만듭니다."
- 기술 태그 (신규): `React · Astro · Supabase · TypeScript`

**데스크톱 앱:**
- 기존: "Electron 기반 크로스플랫폼. 자동 업데이트 · 코드 사이닝 · 배포까지."
- 신규: "Electron 기반 크로스플랫폼. Windows·macOS 양쪽에 자동 업데이트, 코드 사이닝, 로컬 DB, 오프라인 동작까지. TutorMate가 현재 이 스택으로 운영 중입니다."
- 기술 태그: `Electron · SQLite · Auto-Updater`

**B2B 맞춤 개발:**
- 기존: "업무 흐름을 이해하고 거기에 맞는 도구를 만듭니다."
- 신규: "업무 흐름을 걷고 관찰한 뒤 만듭니다. 엑셀로 반복하던 작업을 대시보드로, 수작업으로 하던 일을 자동화로. 기능 개수보다 실제 사용 경험을 우선합니다."
- 기술 태그: `Node.js · PostgreSQL · REST · GraphQL`

**기술 태그 표시:** 카드 본문 아래 작은 Geist 폰트 모노 느낌으로 한 줄 (color: accent, size: 10px, letter-spacing: 0.05em).

### 4.3. Products

**변경 — 제목 카피 수정:**
- 기존: `이론이 아닙니다. 실제로 만들고 운영합니다.`
- 신규: `이론이 아닙니다. 우리가 직접 쓰고, 매주 업데이트합니다.`

"살아있음" + "우리도 사용자" 강조. TutorMate 카드 설명은 그대로 유지.

### 4.4. Contact

**변경 — 서브카피 확장:**
- 기존: `작은 프로젝트도, 큰 프로젝트도 환영합니다.`
- 신규: `작은 프로젝트도, 큰 프로젝트도 환영합니다. 첫 답변은 평일 기준 24시간 내로 드립니다.`

구체적 약속 (응답 시간) 추가.

---

## 5. 타이포그래피 업데이트

### 5.1. 폰트 결정

| 역할 | 폰트 | 비고 |
|---|---|---|
| 한국어 (기본) | **Pretendard Variable** | v1 그대로 유지 |
| 라틴 (디스플레이) | **Geist Variable** | 신규. Vercel 2024 릴리즈. SF Pro 영감. OFL. |
| 라틴 (본문) | **Geist Variable** | 디스플레이와 동일 폰트의 다른 weight 사용 |
| 모노 (필요 시) | `ui-monospace, SF Mono, Menlo` | 시스템 모노 (변경 없음) |

**Inter Variable 은 제거**. Geist가 대체. 파일 1개 (Variable) 로 모든 weight 커버.

### 5.2. Font Stack 정의

```css
@theme {
  --font-sans: 'Pretendard Variable', Pretendard, 'Geist', 'Geist Variable',
    -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-display-latin: 'Geist', 'Geist Variable', -apple-system, sans-serif;
}
```

- 한국어 문자는 Pretendard로 렌더링됨 (앞에 있어서 우선)
- 라틴 문자는 Pretendard가 커버하지 않는 글리프를 Geist로 fallback
- 순수 라틴 영역 (예: "TAKTON LABS" 대문자 로고, FAQ 섹션 라틴 라벨) 에는 `--font-display-latin` 직접 지정

### 5.3. 폰트 자가 호스트

- `public/fonts/Geist-Variable.woff2` 추가 (약 100~150KB 예상)
- 기존 `public/fonts/InterVariable.woff2` 제거
- Base 레이아웃의 `<link rel="preload">` 를 Geist로 교체

### 5.4. OpenType Features

Geist는 아래 feature 지원:

```css
body {
  font-feature-settings: 'ss01', 'ss02', 'cv11', 'tnum', 'zero';
}
```

- `ss01`, `ss02` — stylistic sets
- `cv11` — 대체 글자 (a, g 등)
- `tnum` — tabular numerals (사업자등록번호 정렬)
- `zero` — slashed zero (숫자 가독성)

### 5.5. Weight 사용 가이드

- 400 — 본문
- 500 — 라벨/부제 (Pretendard는 500 대신 600 사용)
- 700 — 카드 제목
- 800 — 섹션 제목
- 900 — 히어로 헤드라인

---

## 6. SEO 강화

### 6.1. 메타 태그 보강

기존 `Base.astro` 의 SEO 블록 유지 + 아래 추가:

```html
<meta name="keywords" content="텍톤랩스, Takton Labs, 소프트웨어 스튜디오, 수강 관리 프로그램, TutorMate, 양산 소프트웨어 개발, Electron 데스크톱 앱, B2B 맞춤 개발" />
<meta name="author" content="Takton Labs" />
<meta name="geo.region" content="KR-48" />
<meta name="geo.placename" content="양산" />
```

### 6.2. 추가 schema.org 마크업

현재 `Organization` 만 있음. 아래 3개 추가:

#### Product (TutorMate)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TutorMate",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Windows, macOS",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
  "publisher": { "@type": "Organization", "name": "Takton Labs" }
}
```

#### Service (핵심 역량 3개를 Service Catalog로)
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Takton Labs",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "소프트웨어 개발 서비스",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "웹·모바일 제품 개발" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "데스크톱 앱 개발" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "B2B 맞춤 소프트웨어 개발" } }
    ]
  }
}
```

#### FAQPage (FAQ 섹션)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "프로젝트 비용은 어떻게 정해지나요?", "acceptedAnswer": { "@type": "Answer", "text": "..." } },
    ...
  ]
}
```

### 6.3. 시맨틱 구조

- 각 섹션에 `<section>` 태그 + `aria-labelledby`
- `h1` 은 페이지 전체에서 1개 (Hero)
- `h2` 는 각 섹션 제목
- `h3` 는 각 카드/항목 제목
- 랜드마크: `<header>`, `<main>`, `<nav>`, `<footer>` 명확히

### 6.4. 본문 키워드 밀도

우선순위 (사용자 선택):
1. **회사 브랜드** — "텍톤랩스", "Takton Labs", "소프트웨어 스튜디오"
2. **제품** — "TutorMate", "수강 관리", "Electron 앱"
3. **서비스** — "웹 개발", "데스크톱 앱 개발", "B2B 맞춤 소프트웨어"

v2 에서 추가되는 콘텐츠 약 3배 분량을 통해 자연스럽게 밀도 상승.

### 6.5. 내부 링크 구조

- Philosophy/Process/Why/FAQ 섹션에서 TutorMate (/tutomate) 와 Contact (#contact) 를 자연스럽게 언급
- FAQ 답변에서 "TutorMate 를 예로 들면..." 같은 내부 링크 추가
- Footer 의 사이트맵 링크 (기존) 그대로 유지

### 6.6. sitemap.xml

기존 `@astrojs/sitemap` 인티그레이션 그대로. 추가 페이지 없음.

---

## 7. 인터랙션 설계

### 7.1. Philosophy 섹션

```typescript
// scroll-animations.ts 에 추가
function animatePhilosophy(): void {
  const cards = document.querySelectorAll('.philosophy-card');
  gsap.from(cards, {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  // 강조 단어 밑줄 draw-in
  const highlights = document.querySelectorAll('.philosophy-highlight');
  highlights.forEach((el) => {
    gsap.from(el.querySelector('.underline'), {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    });
  });
}
```

### 7.2. Process 섹션 (Sticky Progress)

```typescript
function animateProcess(): void {
  if (!isDesktop()) {
    // 모바일: stagger 등장만
    gsap.from('.process-step', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: { trigger: '#process', start: 'top 75%' },
    });
    return;
  }

  // 데스크톱: sticky progress bar + 활성 단계 하이라이트
  const steps = document.querySelectorAll<HTMLElement>('.process-step');
  const markers = document.querySelectorAll<HTMLElement>('.process-marker');

  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 60%',
      onEnter: () => activateStep(i),
      onEnterBack: () => activateStep(i),
    });
  });

  function activateStep(index: number): void {
    markers.forEach((marker, i) => {
      if (i === index) {
        marker.setAttribute('data-active', 'true');
      } else {
        marker.removeAttribute('data-active');
      }
    });
  }
}
```

### 7.3. Why Takton Labs 섹션

```typescript
function animateWhy(): void {
  gsap.from('.why-card', {
    y: 32,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    scrollTrigger: { trigger: '#why', start: 'top 75%' },
  });
}
```

카드 hover: CSS `transform: translate3d(0, -4px, 0)` + `border-color` transition. JS 불필요.

### 7.4. FAQ 아코디언

```typescript
document.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
  const trigger = item.querySelector<HTMLElement>('.faq-trigger');
  const content = item.querySelector<HTMLElement>('.faq-answer');
  if (!trigger || !content) return;

  trigger.addEventListener('click', () => {
    const isOpen = item.getAttribute('data-open') === 'true';
    if (isOpen) {
      item.removeAttribute('data-open');
      content.style.maxHeight = '0';
    } else {
      item.setAttribute('data-open', 'true');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});
```

CSS 트랜지션:
```css
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s var(--ease-in-out);
}
```

### 7.5. Reduced Motion

모든 새 인터랙션은 기존 `showAllImmediately()` 폴백 경로에 추가:

```typescript
function showAllImmediately(): void {
  // 기존
  gsap.set('.word', { opacity: 1, y: 0 });
  gsap.set('[data-window]', { opacity: 1, scale: 1 });
  gsap.set('[data-mint-line]', { scaleX: 1 });
  gsap.set('[data-reveal]', { opacity: 1, y: 0 });
  // 신규
  gsap.set('.philosophy-card', { opacity: 1, y: 0 });
  gsap.set('.philosophy-highlight .underline', { scaleX: 1 });
  gsap.set('.process-step', { opacity: 1, y: 0 });
  gsap.set('.why-card', { opacity: 1, y: 0 });
}
```

---

## 8. 컴포넌트 구조

### 8.1. 신규 Astro 컴포넌트

```
src/components/
├── Philosophy.astro         (신규, 섹션 루트)
├── PhilosophyCard.astro     (신규, 3 가치 카드)
├── Process.astro            (신규, sticky layout 포함)
├── ProcessStep.astro        (신규, 단계 카드)
├── WhyTakton.astro          (신규, 4 약속 그리드)
├── WhyCard.astro            (신규, 약속 카드)
├── Faq.astro                (신규, 아코디언 + JSON-LD)
└── FaqItem.astro            (신규, 개별 Q&A)
```

Capabilities 카드는 기존 `CapabilityCard.astro` 에 props 로 `techStack: string[]` 추가.

### 8.2. 스크립트

`src/scripts/scroll-animations.ts` 에 4 함수 추가:
- `animatePhilosophy()`
- `animateProcess()`
- `animateWhy()`
- (FAQ 아코디언은 별도 `src/scripts/faq.ts` 로 분리)

`src/scripts/faq.ts` (신규) — 아코디언 + 키보드 접근성 (Enter/Space 열기).

### 8.3. 데이터 파일

본문이 길어서 템플릿 안에 하드코딩하면 가독성 떨어짐. 데이터 파일 분리:

```
src/data/
├── tutomate.ts                 (기존)
├── philosophy.ts               (신규, 3 가치)
├── process.ts                  (신규, 4 단계)
├── why.ts                      (신규, 4 약속)
└── faq.ts                      (신규, 6 질문)
```

각 파일은 `TypeScript interface` 정의 + `export const` 배열.

---

## 9. 성능 예산

v1 대비 콘텐츠 약 3배 증가. 하지만 이미지 무거운 요소 없음 (모두 텍스트 + SVG + 폰트). 목표는 유지:

| 메트릭 | 목표 | v1 실측 | v2 예상 |
|---|---|---|---|
| LCP | < 2.0s | 1.2s | 1.4s (+200ms 여유) |
| CLS | < 0.05 | 0.00 | 0.02 (아코디언) |
| Lighthouse Perf | 90+ | 96 | 93 |
| JS 번들 (gzip) | < 150KB | 49.9KB | 56KB (+6KB 신규 스크립트) |
| CSS 번들 (gzip) | < 30KB | 6.4KB | 12KB (+5.6KB 신규 섹션) |
| 폰트 번들 | — | Pretendard 2MB + Inter 350KB | Pretendard 2MB + Geist 100KB (= -250KB) |

**폰트 교체로 총 번들은 오히려 감소.** Geist 가 Inter보다 작음.

---

## 10. 반응형 전략

v1 의 7 단계 브레이크포인트 그대로 사용 (`sm/md/lg/xl/2xl/3xl/4xl`).

### 섹션별 주요 변경

| 섹션 | 모바일 | 태블릿 | 데스크톱 |
|---|---|---|---|
| Philosophy | 세로 스택 | 2 + 1 | 3 가로 |
| Process | 세로 스택 (sticky 비활성) | 세로 스택 | sticky progress bar + 우측 스크롤 |
| Why | 세로 스택 | 2 + 2 | 2 × 2 그리드 |
| FAQ | 1열 (기존과 동일) | 1열 | 1열 (최대 너비 720px) |

### 모바일 우선 원칙 준수

- `hover` 효과는 `@media (hover: hover) and (pointer: fine)` 로 가드
- `sticky` 는 데스크톱에서만 활성
- 애니메이션 duration 은 모바일에서 20% 단축 (기존 규칙)

---

## 11. 접근성

- 모든 신규 섹션 `<section aria-labelledby="...">`
- FAQ 아코디언: `<button aria-expanded>`, `aria-controls`, Enter/Space 키 동작
- Process sticky progress bar: `role="navigation" aria-label="단계"` + 각 마커 `aria-current="step"`
- 강조 단어 `<span>` + `.sr-only` 설명 불필요 (시각적 강조만)
- `prefers-reduced-motion` 폴백 처리 (§ 7.5)
- 색상 명도비 WCAG AA 유지 (기존 규칙)
- Tab 키 논리적 순서: Nav → Hero → Philosophy → Capabilities → Process → Why → Products → FAQ → Contact → Footer

---

## 12. 테스트 전략

### 12.1. Playwright 스모크 (신규 테스트)

기존 18개 케이스 + 아래 추가:

1. **Philosophy 섹션 렌더링** — 3 카드 + 강조 단어 확인
2. **Process 섹션 4 단계 렌더링** — sticky 동작 (desktop only)
3. **Why 섹션 4 카드 렌더링**
4. **FAQ 아코디언 동작** — 클릭 시 확장, 재클릭 시 수축, ARIA 상태
5. **FAQ JSON-LD 존재** — `<script type="application/ld+json">` 에 FAQPage schema
6. **Geist 폰트 로드 확인** — `document.fonts.ready` + family check
7. **reduced-motion 하에서 모든 신규 섹션 opacity: 1** 즉시 표시

목표: 25개 테스트 (기존 18 + 신규 7), 54개 실행 (3 브라우저 × 18 + 3 × 7 = 75). 모바일 Safari 제외할 수 있는 테스트는 제외.

### 12.2. Lighthouse 감사

- Mobile + Desktop 모두 90+
- SEO 점수 특별히 확인 (신규 schema 효과)
- 리치 스니펫 미리보기 (Google Rich Results Test)

### 12.3. 수동 반응형

- 360 / 768 / 1024 / 1280 / 1920px 에서 각 신규 섹션 레이아웃 확인
- 특히 Process sticky 는 lg 경계선에서 정확히 전환되는지

---

## 13. 단계별 빌드 순서 (writing-plans 가이드)

1. **폰트 교체** — Geist Variable 자가 호스트, tokens.css 수정, Base.astro preload 교체
2. **데이터 파일** — philosophy.ts / process.ts / why.ts / faq.ts 생성
3. **Philosophy 섹션** — 컴포넌트 2개 + index.astro 통합
4. **Capabilities 카피 보강** — 카드별 description 확장 + 기술 태그
5. **Process 섹션** — 컴포넌트 2개 + sticky 레이아웃 (데스크톱) + 모바일 폴백
6. **Why Takton Labs 섹션** — 컴포넌트 2개 + 2×2 그리드
7. **Products 헤드라인 미세 수정**
8. **FAQ 섹션** — 컴포넌트 2개 + 아코디언 스크립트 + FAQPage JSON-LD
9. **Contact 서브카피 확장**
10. **Hero 서브카피 확장**
11. **SEO schema 추가** — Product / Service / FAQPage JSON-LD (Base.astro)
12. **스크롤 애니메이션** — scroll-animations.ts 에 4 함수 추가 + reduced-motion 폴백
13. **접근성 패스** — aria 속성 추가, Tab 순서 검증
14. **Playwright 테스트 추가** — 7 신규 케이스
15. **Lighthouse + Rich Results Test 검증**
16. **Git commit (feat/landing-implementation) + 사용자 확인**

---

## 14. 해결 보류 (Open Questions)

- **FAQ 비용 범위 숫자** — "수백만원" / "수천만원" 표현이 맞는지 사용자 확인 필요 (현재 스펙은 가정)
- **Process 각 단계 원칙 3개 bullet** — 사용자가 실제로 그렇게 일하는지 확인 필요 (이상적인 공정 설명)
- **Why 카드의 "월 정액 유지보수"** — 실제 지원 가능한 모델인지 확인 필요
- **TutorMate 페이지 (`/tutomate`)** 에서 이 섹션들의 재사용 여부 — 현재 스펙은 `/` 만 대상
- **블로그 섹션 (미래)** — Insights 섹션 티저를 나중에 추가할 여지가 있음
