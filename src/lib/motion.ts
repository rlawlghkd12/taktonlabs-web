// src/lib/motion.ts
import type { gsap as GSAPType } from 'gsap';

/**
 * CSS custom property와 동일한 이징 커브.
 * GSAP 옵션 string 형태로 반환.
 */
export const EASE = {
  expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  detail: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

/**
 * reduced-motion 선호 여부. SSR-safe.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 뷰포트가 데스크톱 기준인지. pinned 인터랙션 분기용.
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(min-width: 768px)').matches;
}

/**
 * GSAP + ScrollTrigger 동적 import. 필요한 컴포넌트에서만 로드.
 */
export async function loadGsap(): Promise<{
  gsap: typeof GSAPType;
  ScrollTrigger: unknown;
}> {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
