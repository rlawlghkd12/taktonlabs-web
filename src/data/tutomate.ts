/**
 * TutorMate 제품 메타데이터 (regular + Q variant).
 *
 * **정적 fallback 값**. 실제 최신 버전/릴리즈 날짜/다운로드 URL은
 * TutomateDownloadPage.astro 의 클라이언트 JS가 런타임에 GitHub API 에서 fetch 해서
 * DOM 을 업데이트함. 재배포 없이 새 릴리즈가 즉시 반영됨.
 *
 * 아래 version/releaseDate/*Url 은 API 호출 실패 시나 JS 비활성 시 표시되는 fallback.
 */

export type TutomateSlug = 'regular' | 'q';

export interface TutomateVariant {
  slug: TutomateSlug;
  name: string;
  tagline: string;
  description: string;
  version: string;
  releaseDate: string;
  githubRepo: string;
  iconSrc: string;
  macUrl: string;
  winUrl: string;
  systemRequirements: {
    mac: string;
    windows: string;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
}

// ============ Static base metadata ============
// 이름/태그라인/설명/아이콘/기능 등은 고정. version/url은 빌드 타임에 덮어씀.

const GITHUB_REPO = 'rlawlghkd12/tutomate';
const FALLBACK_VERSION = '0.6.5';
const FALLBACK_DATE = '2026-04-09';

function fallbackRegularUrl(platform: 'mac' | 'windows'): string {
  const base = `https://github.com/${GITHUB_REPO}/releases/latest/download`;
  if (platform === 'mac')
    return `${base}/TutorMate-${FALLBACK_VERSION}-universal.dmg`;
  return `${base}/TutorMate-Setup-${FALLBACK_VERSION}.exe`;
}

function fallbackQUrl(platform: 'mac' | 'windows'): string {
  const base = `https://github.com/${GITHUB_REPO}/releases/latest/download`;
  if (platform === 'mac')
    return `${base}/TutorMate-Q-${FALLBACK_VERSION}-universal-mac.dmg`;
  return `${base}/TutorMate-Q-Setup-${FALLBACK_VERSION}.exe`;
}

export const tutomate: TutomateVariant = {
  slug: 'regular',
  name: 'TutorMate',
  tagline: '누구나 쉽게 쓰는 수강 관리 데스크톱 앱',
  description:
    '수강생 관리, 결제 이력, 대시보드까지 직관적으로. 큰 글씨와 단순한 인터페이스로 누구나 쉽게.',
  version: FALLBACK_VERSION,
  releaseDate: FALLBACK_DATE,
  githubRepo: GITHUB_REPO,
  iconSrc: '/tutomate/app-icon.png',
  macUrl: fallbackRegularUrl('mac'),
  winUrl: fallbackRegularUrl('windows'),
  systemRequirements: {
    mac: 'macOS 10.15 (Catalina) 이상 · Intel / Apple Silicon Universal',
    windows: 'Windows 10/11 · 64bit',
  },
  features: [
    {
      title: '직관적인 UI',
      description: '큰 글씨, 명확한 버튼. 설명서 없이 시작할 수 있습니다.',
    },
    {
      title: '자동 업데이트',
      description:
        '새 기능이 나오면 자동으로 업데이트. 고민 없이 최신 상태 유지.',
    },
    {
      title: '오프라인 동작',
      description:
        '인터넷 없어도 기본 기능 사용 가능. 네트워크 걱정 없이.',
    },
  ],
};

export const tutomateQ: TutomateVariant = {
  slug: 'q',
  name: 'TutorMate Q',
  tagline: '현대적인 UI를 선호하는 강사를 위한 버전',
  description:
    '더 세련된 인터페이스와 빠른 동작. 익숙한 기능은 그대로, 경험은 한 단계 업그레이드.',
  version: FALLBACK_VERSION,
  releaseDate: FALLBACK_DATE,
  githubRepo: GITHUB_REPO,
  iconSrc: '/tutomate-q/app-icon.png',
  macUrl: fallbackQUrl('mac'),
  winUrl: fallbackQUrl('windows'),
  systemRequirements: {
    mac: 'macOS 10.15 (Catalina) 이상 · Intel / Apple Silicon Universal',
    windows: 'Windows 10/11 · 64bit',
  },
  features: [
    {
      title: '현대적 디자인',
      description: '최신 디자인 트렌드를 반영한 깔끔한 인터페이스.',
    },
    {
      title: '빠른 성능',
      description: '최적화된 렌더링으로 더 빠르게 반응합니다.',
    },
    {
      title: '자동 업데이트',
      description: '동일한 자동 업데이트 시스템. 항상 최신 상태로.',
    },
  ],
};

