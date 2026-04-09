/**
 * TutorMate 제품 메타데이터.
 * 새 릴리즈마다 이 파일의 `version` 과 `releaseDate` 만 업데이트하면
 * 다운로드 페이지가 자동으로 최신 버전을 가리킴.
 */

export const tutomate = {
  name: 'TutorMate',
  tagline: '60대 이상 강사를 위한 수강 관리 데스크톱 앱',
  description:
    '수강생 관리, 결제 이력, 대시보드까지 직관적으로. 큰 글씨와 단순한 인터페이스로 누구나 쉽게.',
  version: '0.6.0',
  releaseDate: '2026-04-09',
  githubRepo: 'rlawlghkd12/tutomate',
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
      description: '새 기능이 나오면 자동으로 업데이트. 고민 없이 최신 상태 유지.',
    },
    {
      title: '오프라인 동작',
      description: '인터넷 없어도 기본 기능 사용 가능. 네트워크 걱정 없이.',
    },
  ],
} as const;

/**
 * GitHub Releases의 latest 태그에서 직접 다운로드하는 URL 생성.
 * 파일명에 버전이 포함되므로, version 업데이트 시 URL도 자동 갱신됨.
 */
export function getDownloadUrl(platform: 'mac' | 'windows'): string {
  const base = `https://github.com/${tutomate.githubRepo}/releases/latest/download`;
  if (platform === 'mac') {
    return `${base}/TutorMate-${tutomate.version}-universal.dmg`;
  }
  return `${base}/TutorMate-Setup-${tutomate.version}.exe`;
}
