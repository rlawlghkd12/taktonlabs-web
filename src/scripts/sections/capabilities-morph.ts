// src/scripts/sections/capabilities-morph.ts
import { EASE, prefersReducedMotion, isDesktopViewport, loadGsap } from '../../lib/motion';

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

  // pin 섹션 높이 설정
  section.style.height = '300vh';
  const pinEl = section.querySelector<HTMLElement>('.cap-pin')!;
  pinEl.style.position = 'sticky';
  pinEl.style.top = '0';
  pinEl.style.height = '100vh';

  const stage = section.querySelector<HTMLElement>('[data-cap-stage]')!;

  // Precompute dock positions on every ScrollTrigger refresh (handles resize)
  const dockTargets: { top: number; left: number; width: number; height: number }[] = [0, 1, 2].map(() => ({ top: 0, left: 0, width: 0, height: 0 }));
  function measureDockTargets() {
    const stageRect = stage.getBoundingClientRect();
    docks.forEach((dock, i) => {
      const r = dock.getBoundingClientRect();
      dockTargets[i] = {
        top: r.top - stageRect.top,
        left: r.left - stageRect.left,
        width: r.width,
        height: r.height,
      };
    });
  }

  // Initial state lock
  gsap.set(cards[0], { opacity: 1, top: 0, left: 0, width: '100%', height: 'auto' });
  gsap.set(cards[1], { opacity: 0, y: 20 });
  gsap.set(cards[2], { opacity: 0, y: 20 });
  gsap.set(docks, { opacity: 0 });
  cards.forEach((c) => { c.dataset.docked = 'false'; });

  // Build timeline using scrubbed tweens
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,                // slightly looser than 1 for buttery feel
      invalidateOnRefresh: true,
      onRefreshInit: measureDockTargets,
      onRefresh: measureDockTargets,
    },
  });

  function addCardLifecycle(idx: number, enterFrom: number, bigEnd: number, shrinkEnd: number) {
    const card = cards[idx];
    const morphDur = shrinkEnd - bigEnd;

    // Enter (for idx 1, 2)
    if (idx > 0) {
      tl.to(card, { opacity: 1, y: 0, ease: EASE.expo, duration: 1 }, enterFrom);
    }

    // Collapse details BEFORE box morph (slightly earlier, shorter)
    tl.to(
      card.querySelectorAll('.cc-desc, .cc-principles, .cc-right'),
      { opacity: 0, ease: EASE.detail, duration: morphDur * 0.55 },
      bigEnd - 0.02,
    );

    // SCRUBBED box morph — use function refs so dockTargets is always current
    tl.to(card, {
      top: () => dockTargets[idx].top,
      left: () => dockTargets[idx].left,
      width: () => dockTargets[idx].width,
      height: () => dockTargets[idx].height,
      ease: EASE.expo,
      duration: morphDur,
    }, bigEnd);

    // Docked state flip (onStart / onReverseComplete via dummy tween)
    tl.to({}, {
      duration: 0.01,
      onStart: () => { card.dataset.docked = 'true'; },
      onReverseComplete: () => { card.dataset.docked = 'false'; },
    }, shrinkEnd);

    // Dock slot reveal
    tl.to(docks[idx], { opacity: 1, duration: 0.2, ease: EASE.smooth }, shrinkEnd - 0.05);
  }

  addCardLifecycle(0, 0, 0.22, 0.38);
  addCardLifecycle(1, 0.25, 0.56, 0.74);
  addCardLifecycle(2, 0.60, 0.88, 1.00);

  // eyebrow title swap — use dummy tween with onStart/onReverseComplete for scrub-reversible behavior
  const titleSwaps = [
    { at: 0.38, forward: titles[1], back: titles[0] },
    { at: 0.74, forward: titles[2], back: titles[1] },
  ];
  titleSwaps.forEach((t) => {
    tl.to({}, {
      duration: 0.01,
      onStart: () => { if (activeTitleEl) activeTitleEl.textContent = t.forward; },
      onReverseComplete: () => { if (activeTitleEl) activeTitleEl.textContent = t.back; },
    }, t.at);
  });

  // Progress segments — scrubbed fill (use data-filled with onStart/onReverseComplete)
  const segMilestones = [0.22, 0.56, 0.88];
  segMilestones.forEach((at, i) => {
    tl.to({}, {
      duration: 0.01,
      onStart: () => { progressSegs[i].dataset.filled = 'true'; },
      onReverseComplete: () => { progressSegs[i].dataset.filled = 'false'; },
    }, at);
  });
}
