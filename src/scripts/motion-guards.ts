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
