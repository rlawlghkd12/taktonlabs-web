import Lenis from 'lenis';
import { prefersReducedMotion, hasHover } from './motion-guards';

let lenisInstance: Lenis | null = null;

/**
 * Lenis 스무스 스크롤 초기화.
 *
 * 활성화 조건:
 * - prefers-reduced-motion 이 아닐 것
 * - hover 디바이스일 것 (모바일/터치 제외)
 *
 * 모바일/터치는 iOS Safari · Android Chrome 의 네이티브 momentum scroll 을
 * 그대로 사용. Lenis 의 touch 동기화는 네이티브 감각을 해치고 ScrollTrigger
 * 와의 timing 이 불안정해짐.
 *
 * 주의: rAF 루프는 여기서 만들지 않는다. scroll-animations.ts 의 gsap.ticker
 * 가 lenis.raf() 를 드라이브한다 (단일 루프).
 */
export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion() || !hasHover()) {
    return null;
  }

  const lenis = new Lenis({
    duration: 1.4,
    lerp: 0.08,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out — standard Lenis ease
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
  });

  // Nav 앵커 클릭 Lenis에 위임
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });

  lenisInstance = lenis;
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
