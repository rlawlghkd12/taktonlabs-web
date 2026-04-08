import Lenis from 'lenis';
import { prefersReducedMotion } from './motion-guards';

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  // 접근성: reduced-motion 시 네이티브 스크롤 사용
  if (prefersReducedMotion()) {
    return null;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => 1 - Math.pow(1 - t, 3), // 3차 감속 (부드러움 축)
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

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
