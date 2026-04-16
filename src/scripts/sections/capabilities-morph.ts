// src/scripts/sections/capabilities-morph.ts
import { EASE, prefersReducedMotion, isDesktopViewport, loadGsap } from '../../lib/motion';

interface DockTarget { top: number; left: number; width: number; height: number; }

export async function initCapabilitiesMorph(): Promise<void> {
  const section = document.querySelector<HTMLElement>('#capabilities');
  if (!section) return;

  if (prefersReducedMotion() || !isDesktopViewport()) {
    // Fallback: sticky pin 해제, dock bar 숨김, 3 카드를 세로 스택으로 자연스럽게 노출
    const pin = section.querySelector<HTMLElement>('.cap-pin');
    if (pin) {
      pin.style.position = 'static';
      pin.style.height = 'auto';
      pin.style.minHeight = 'auto';
    }
    const dockBar = section.querySelector<HTMLElement>('.cap-dock-bar');
    if (dockBar) dockBar.style.display = 'none';

    const stage = section.querySelector<HTMLElement>('[data-cap-stage]');
    if (stage) {
      stage.style.position = 'static';
      stage.style.display = 'flex';
      stage.style.flexDirection = 'column';
      stage.style.gap = '24px';
      stage.style.minHeight = 'auto';
    }

    section.querySelectorAll<HTMLElement>('[data-cap-card]').forEach((el) => {
      el.style.position = 'relative';
      el.style.inset = 'auto';
      el.style.opacity = '1';
      el.style.top = 'auto';
      el.style.left = 'auto';
      el.style.width = 'auto';
      el.style.height = 'auto';
    });
    return;
  }

  const { gsap } = await loadGsap();

  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-cap-card]'));
  const docks = Array.from(section.querySelectorAll<HTMLElement>('[data-cap-dock]'));
  const progressSegs = Array.from(section.querySelectorAll<HTMLElement>('.cap-progress-seg'));
  const activeTitleEl = section.querySelector<HTMLElement>('[data-cap-active-title]');
  const titles = ['01 · 웹 · 모바일 제품', '02 · 데스크톱 앱', '03 · B2B 맞춤 개발'];

  // Initial state lock — 01 visible, 02/03 hidden, docks hidden
  gsap.set(cards[0], { opacity: 1, top: 0, left: 0, width: '100%', height: 'auto' });
  gsap.set(cards[1], { opacity: 0, y: 20 });
  gsap.set(cards[2], { opacity: 0, y: 20 });
  gsap.set(docks, { opacity: 0 });

  // pin 섹션 높이 설정
  section.style.height = '300vh';
  const pinEl = section.querySelector<HTMLElement>('.cap-pin')!;
  pinEl.style.position = 'sticky';
  pinEl.style.top = '0';
  pinEl.style.height = '100vh';

  // dock 슬롯의 타깃 좌표 측정 (stage 기준 상대좌표)
  const stage = section.querySelector<HTMLElement>('[data-cap-stage]')!;
  function getDockTarget(idx: number): DockTarget {
    const dock = docks[idx];
    const stageRect = stage.getBoundingClientRect();
    const dockRect = dock.getBoundingClientRect();
    return {
      top: dockRect.top - stageRect.top,
      left: dockRect.left - stageRect.left,
      width: dockRect.width,
      height: dockRect.height,
    };
  }

  // 타임라인
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // 각 카드 life-cycle
  // 01: BIG 0~0.22 → shrink 0.22~0.38 → stay docked
  // 02: enter 0.25~0.40 → BIG 0.40~0.56 → shrink 0.56~0.74
  // 03: enter 0.60~0.76 → BIG 0.76~0.88 → shrink 0.88~1.00

  function addCardLifecycle(idx: number, enterFrom: number, bigEnd: number, shrinkEnd: number) {
    const card = cards[idx];
    // 진입: 02, 03만 enterFrom 구간에서 opacity 0 → 1, y 20 → 0
    if (idx > 0) {
      gsap.set(card, { opacity: 0, y: 20 });
      tl.to(card, { opacity: 1, y: 0, ease: EASE.expo, duration: 1 }, enterFrom);
    }
    // shrink: bigEnd ~ shrinkEnd 구간에서 dock 좌표로 morph
    tl.call(
      () => {
        const target = getDockTarget(idx);
        gsap.to(card, {
          top: target.top,
          left: target.left,
          width: target.width,
          height: target.height,
          ease: EASE.expo,
          overwrite: true,
          scrollTrigger: undefined,
        });
      },
      undefined,
      bigEnd,
    );
    // 내부 요소 축소 — font-size 보간
    tl.to(card.querySelector('.cc-num'), { fontSize: 16, duration: shrinkEnd - bigEnd, ease: EASE.expo }, bigEnd);
    tl.to(card.querySelector('.cc-title'), { fontSize: 13, duration: shrinkEnd - bigEnd, ease: EASE.expo }, bigEnd);
    // 설명/프루프 먼저 접힘
    tl.to(card.querySelectorAll('.cc-desc, .cc-principles, .cc-right'), { opacity: 0, maxHeight: 0, duration: (shrinkEnd - bigEnd) * 0.6, ease: EASE.detail }, bigEnd - 0.02);
    // dock slot 표시 (완료 직후)
    tl.to(docks[idx], { opacity: 1, duration: 0.15, ease: EASE.smooth }, shrinkEnd);
  }

  addCardLifecycle(0, 0, 0.22, 0.38);
  addCardLifecycle(1, 0.25, 0.56, 0.74);
  addCardLifecycle(2, 0.60, 0.88, 1.00);

  // eyebrow 활성 타이틀 교체
  const titleSwap = [
    { at: 0.38, text: titles[1] },
    { at: 0.74, text: titles[2] },
  ];
  titleSwap.forEach((t) => {
    tl.call(() => { if (activeTitleEl) activeTitleEl.textContent = t.text; }, undefined, t.at);
  });

  // progress segments
  const segMilestones = [0.22, 0.56, 0.88];
  segMilestones.forEach((at, i) => {
    tl.call(() => { progressSegs[i].dataset.filled = 'true'; }, undefined, at);
  });
}
