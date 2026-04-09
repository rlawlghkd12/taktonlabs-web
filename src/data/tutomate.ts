/**
 * TutorMate 제품 메타데이터 (regular + Q variant).
 * 새 릴리즈마다 각 variant의 `version` 과 `releaseDate` 만 업데이트하면
 * 다운로드 페이지가 자동으로 최신 버전을 가리킴.
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
  systemRequirements: {
    mac: string;
    windows: string;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
}

export const tutomate: TutomateVariant = {
  slug: 'regular',
  name: 'TutorMate',
  tagline: '60대 이상 강사를 위한 수강 관리 데스크톱 앱',
  description:
    '수강생 관리, 결제 이력, 대시보드까지 직관적으로. 큰 글씨와 단순한 인터페이스로 누구나 쉽게.',
  version: '0.6.0',
  releaseDate: '2026-04-09',
  githubRepo: 'rlawlghkd12/tutomate',
  iconSrc: '/tutomate/app-icon.png',
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
  version: '0.6.0',
  releaseDate: '2026-04-09',
  githubRepo: 'rlawlghkd12/tutomate',
  iconSrc: '/tutomate-q/app-icon.png',
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

/**
 * GitHub Releases의 latest 태그에서 직접 다운로드하는 URL 생성.
 * 파일명에 버전이 포함되므로, version 업데이트 시 URL도 자동 갱신됨.
 */
export function getDownloadUrl(
  variant: TutomateVariant,
  platform: 'mac' | 'windows'
): string {
  const base = `https://github.com/${variant.githubRepo}/releases/latest/download`;
  if (variant.slug === 'q') {
    if (platform === 'mac') {
      return `${base}/TutorMate-Q-${variant.version}-universal-mac.dmg`;
    }
    return `${base}/TutorMate-Q-Setup-${variant.version}.exe`;
  }
  if (platform === 'mac') {
    return `${base}/TutorMate-${variant.version}-universal.dmg`;
  }
  return `${base}/TutorMate-Setup-${variant.version}.exe`;
}
