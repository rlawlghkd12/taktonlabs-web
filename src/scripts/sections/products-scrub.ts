// src/scripts/sections/products-scrub.ts
import { EASE, prefersReducedMotion, isDesktopViewport, loadGsap } from '../../lib/motion';

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
    // 모든 화면·캡션 펼치기
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
    // 인디케이터·progress bar 숨김
    const indicators = section.querySelector<HTMLElement>('.prod-indicators');
    if (indicators) indicators.style.display = 'none';
    section.querySelectorAll<HTMLElement>('.prod-progress .seg').forEach((el) => {
      el.dataset.filled = 'true';
    });
    return;
  }

  const { gsap } = await loadGsap();
  const pinEl = section.querySelector<HTMLElement>('.prod-pin')!;
  const screens = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-screen]'));
  const captions = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-caption]'));
  const indicators = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-indicator]'));
  const progressSegs = Array.from(section.querySelectorAll<HTMLElement>('.prod-progress .seg'));
  const windowTitle = section.querySelector<HTMLElement>('[data-prod-window-title]');
  const titles = ['TutorMate — 대시보드', 'TutorMate — 수강생', 'TutorMate — 수익'];

  // Rail 설정 — 이 레일 안에서만 pin이 sticky로 동작
  const rail = section.querySelector<HTMLElement>('[data-prod-rail]')!;
  rail.style.height = '280vh';
  pinEl.style.position = 'sticky';
  pinEl.style.top = '0';
  pinEl.style.height = '100vh';
  // section.style.height 설정 제거 — rail + CTA + tags가 자연 flow로 쌓임

  const tl = gsap.timeline({
    scrollTrigger: { trigger: rail, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  });

  function switchTo(idx: number, at: number) {
    // 현재 활성화된 것만 opacity 1, 나머지는 0
    screens.forEach((s, i) => {
      tl.to(s, { opacity: i === idx ? 1 : 0, scale: i === idx ? 1 : 1.02, duration: 0.4, ease: EASE.expo }, at);
    });
    captions.forEach((c, i) => {
      tl.to(c, { opacity: i === idx ? 1 : 0, y: i === idx ? 0 : 8, duration: 0.4, ease: EASE.smooth }, at - 0.03);
    });
    indicators.forEach((el, i) => {
      tl.call(() => { el.dataset.active = String(i === idx); }, undefined, at);
    });
    tl.call(() => {
      if (windowTitle) windowTitle.textContent = titles[idx];
      progressSegs.forEach((seg, i) => { seg.dataset.filled = String(i <= idx); });
    }, undefined, at);
  }

  switchTo(0, 0);
  switchTo(1, 0.33);
  switchTo(2, 0.66);
}
