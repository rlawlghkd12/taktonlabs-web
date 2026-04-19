// src/scripts/sections/products-scrub.ts
// Products 섹션 — 섹션 진입 시 3개 화면/캡션이 타이머 기반으로 자동 순환.
// 스크롤 위치와 분리되어 mid-scroll에서 오버랩이 발생하지 않음.

import { prefersReducedMotion, isDesktopViewport } from '../../lib/motion';

const CYCLE_MS = 3400;

export async function initProductsScrub(): Promise<void> {
  const section = document.querySelector<HTMLElement>('#products');
  if (!section) return;

  if (prefersReducedMotion() || !isDesktopViewport()) {
    const pin = section.querySelector<HTMLElement>('.prod-pin');
    if (pin) {
      pin.style.position = 'static';
      pin.style.height = 'auto';
      pin.style.minHeight = 'auto';
    }
    const rail = section.querySelector<HTMLElement>('[data-prod-rail]');
    if (rail) {
      rail.style.height = 'auto';
    }
    section.querySelectorAll<HTMLElement>('[data-prod-screen]').forEach((el) => {
      el.style.position = 'relative';
      el.style.inset = 'auto';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    section.querySelectorAll<HTMLElement>('[data-prod-caption]').forEach((el) => {
      el.style.position = 'relative';
      el.style.inset = 'auto';
      el.style.opacity = '1';
    });
    const indicators = section.querySelector<HTMLElement>('.prod-indicators');
    if (indicators) indicators.style.display = 'none';
    section.querySelectorAll<HTMLElement>('.prod-progress .seg').forEach((el) => {
      el.dataset.filled = 'true';
    });
    return;
  }

  const pinEl = section.querySelector<HTMLElement>('.prod-pin')!;
  const rail = section.querySelector<HTMLElement>('[data-prod-rail]')!;
  const screens = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-screen]'));
  const captions = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-caption]'));
  const indicators = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-indicator]'));
  const progressSegs = Array.from(section.querySelectorAll<HTMLElement>('.prod-progress .seg'));
  const windowTitleItems = Array.from(
    section.querySelectorAll<HTMLElement>('.window-title-stack .window-title'),
  );

  // Sticky pin 설정 — 레일 안에서 280vh 동안 고정
  rail.style.height = '280vh';
  pinEl.style.position = 'sticky';
  pinEl.style.top = '0';
  pinEl.style.height = '100vh';

  // CSS transitions — 타이머 전환 시 부드러운 페이드
  const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const SMOOTH = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
  screens.forEach((s) => {
    s.style.transition = `opacity 0.7s ${EXPO}, transform 0.7s ${EXPO}`;
    s.style.willChange = 'opacity, transform';
  });
  captions.forEach((c) => {
    c.style.transition = `opacity 0.55s ${SMOOTH}, transform 0.55s ${SMOOTH}`;
    c.style.willChange = 'opacity, transform';
  });
  windowTitleItems.forEach((el) => {
    el.style.transition = `opacity 0.45s ${SMOOTH}`;
  });
  indicators.forEach((el) => {
    el.style.transition = `opacity 0.35s ${SMOOTH}`;
  });

  function showIndex(idx: number): void {
    screens.forEach((s, i) => {
      s.style.opacity = i === idx ? '1' : '0';
      s.style.transform = i === idx ? 'scale(1)' : 'scale(1.04)';
    });
    captions.forEach((c, i) => {
      c.style.opacity = i === idx ? '1' : '0';
      c.style.transform = i === idx ? 'translateY(0)' : 'translateY(12px)';
    });
    windowTitleItems.forEach((el, i) => {
      el.style.opacity = i === idx ? '1' : '0';
    });
    indicators.forEach((el, i) => {
      el.style.opacity = i === idx ? '1' : '0.35';
      el.dataset.active = String(i === idx);
    });
    progressSegs.forEach((seg, i) => {
      seg.dataset.filled = String(i <= idx);
    });
  }

  // 초기 상태
  showIndex(0);

  // 자동 순환 — IntersectionObserver로 섹션 보일 때만 작동
  let currentIdx = 0;
  let interval: number | null = null;

  function next(): void {
    currentIdx = (currentIdx + 1) % 3;
    showIndex(currentIdx);
  }

  function start(): void {
    if (interval !== null) return;
    interval = window.setInterval(next, CYCLE_MS);
  }

  function stop(): void {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.3 },
  );
  observer.observe(pinEl);

  // 탭 비활성/blur 시 타이머 절약
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (pinEl.getBoundingClientRect().top < window.innerHeight && pinEl.getBoundingClientRect().bottom > 0) {
      start();
    }
  });
}
