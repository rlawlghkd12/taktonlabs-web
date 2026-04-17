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
  const titleItems = Array.from(section.querySelectorAll<HTMLElement>('.cap-title-item'));

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

  // Initial state lock — 모든 카드가 stage 안에서 inset:0 (CSS 상속)으로 풀 사이즈
  gsap.set(cards[0], { opacity: 1 });
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
      scrub: 0.4,                // 스크롤과 1:1에 가까운 반응성 유지
      invalidateOnRefresh: true,
      onRefreshInit: measureDockTargets,
      onRefresh: measureDockTargets,
    },
  });

  function addCardLifecycle(idx: number, enterFrom: number, bigEnd: number, shrinkEnd: number) {
    const card = cards[idx];
    const morphDur = shrinkEnd - bigEnd;
    const numEl = card.querySelector<HTMLElement>('.cc-num');
    const titleEl = card.querySelector<HTMLElement>('.cc-title');

    // Enter (for idx 1, 2) — 빠른 fade-up (이전 0.25~bigEnd 범위에서 완료)
    if (idx > 0) {
      tl.to(card, { opacity: 1, y: 0, ease: EASE.expo, duration: 0.15 }, enterFrom);
    }

    // Collapse description + proof frame — 설명/프루프만 숨김 (principles는 dock state까지 유지)
    tl.to(
      card.querySelectorAll('.cc-desc, .cc-right'),
      { opacity: 0, ease: EASE.detail, duration: morphDur * 0.55 },
      bigEnd - 0.02,
    );

    // SCRUBBED box morph — use function refs so dockTargets is always current
    tl.to(card, {
      top: () => dockTargets[idx].top,
      left: () => dockTargets[idx].left,
      width: () => dockTargets[idx].width,
      height: () => dockTargets[idx].height,
      padding: 22,
      borderRadius: 12,
      boxShadow: '0 2px 8px -4px rgba(0,0,0,0.05)',
      ease: EASE.expo,
      duration: morphDur,
    }, bigEnd);

    // Accent bar + check mark 연속 fade-in — morph 후반에 등장
    const accent = card.querySelector<HTMLElement>('[data-cc-accent]');
    const check = card.querySelector<HTMLElement>('[data-cc-check]');
    if (accent) {
      tl.to(accent, {
        opacity: 0.85,
        scaleY: 1,
        ease: EASE.expo,
        duration: morphDur * 0.6,
      }, bigEnd + morphDur * 0.4);
    }
    if (check) {
      tl.to(check, {
        opacity: 0.6,
        scale: 1,
        ease: EASE.smooth,
        duration: morphDur * 0.4,
      }, bigEnd + morphDur * 0.6);
    }

    // Content font-size / margin 연속 보간 — box morph와 동기
    if (numEl) {
      // 숫자는 gradient stop을 38% → 100%로 채워 solid로 전환 (stroke 얇아질 때 반쪽만 남는 현상 제거)
      tl.to(numEl, {
        fontSize: 20,
        marginBottom: 0,
        lineHeight: 1,
        webkitTextStrokeWidth: 0,
        '--grad-stop': '100%',
        ease: EASE.expo,
        duration: morphDur,
      }, bigEnd);
    }
    if (titleEl) {
      tl.to(titleEl, {
        fontSize: 15,
        marginBottom: 0,
        ease: EASE.expo,
        duration: morphDur,
      }, bigEnd);
    }

    // Docked state flip — 내용이 이미 14px로 축소된 상태라 layout flip 시각 점프 최소
    tl.to({}, {
      duration: 0.01,
      onStart: () => { card.dataset.docked = 'true'; },
      onReverseComplete: () => { card.dataset.docked = 'false'; },
    }, shrinkEnd);

    // Dock slot reveal
    tl.to(docks[idx], { opacity: 1, duration: 0.2, ease: EASE.smooth }, shrinkEnd - 0.05);
  }

  // 카드 간 전환 길게 — shrink 각 22%, BIG dwell 짧게
  addCardLifecycle(0, 0,    0.10, 0.32);  // 01 BIG 10% → shrink 22%
  addCardLifecycle(1, 0.13, 0.48, 0.70);  // enter 0.13~0.28, BIG 0.32~0.48, shrink 22%
  addCardLifecycle(2, 0.51, 0.82, 1.00);  // enter 0.51~0.66, BIG 0.70~0.82, shrink 18%

  // eyebrow title crossfade — 3개 span을 스크럽으로 opacity 전환 (부드러운 크로스페이드)
  if (titleItems.length === 3) {
    gsap.set(titleItems[0], { opacity: 1 });
    gsap.set(titleItems[1], { opacity: 0 });
    gsap.set(titleItems[2], { opacity: 0 });
    // 01 → 02 transition: 카드 0 shrink 후반 ~ 카드 1 BIG 초반
    tl.to(titleItems[0], { opacity: 0, ease: EASE.smooth, duration: 0.14 }, 0.22);
    tl.to(titleItems[1], { opacity: 1, ease: EASE.smooth, duration: 0.14 }, 0.22);
    // 02 → 03 transition: 카드 1 shrink 후반 ~ 카드 2 BIG 초반
    tl.to(titleItems[1], { opacity: 0, ease: EASE.smooth, duration: 0.14 }, 0.60);
    tl.to(titleItems[2], { opacity: 1, ease: EASE.smooth, duration: 0.14 }, 0.60);
  }

  // Outro (결론 + Process 앵커) — 카드 3 shrink 완료 즈음 등장
  const outro = section.querySelector<HTMLElement>('[data-cap-outro]');
  if (outro) {
    gsap.set(outro, { opacity: 0, y: 24, pointerEvents: 'none' });
    tl.to(outro, {
      opacity: 1,
      y: 0,
      pointerEvents: 'auto',
      ease: EASE.expo,
      duration: 0.12,
    }, 0.88);
  }

  // Progress segments — 각 카드 shrink 완료 시점에 채움
  const segMilestones = [0.32, 0.70, 1.00];
  segMilestones.forEach((at, i) => {
    tl.to({}, {
      duration: 0.01,
      onStart: () => { progressSegs[i].dataset.filled = 'true'; },
      onReverseComplete: () => { progressSegs[i].dataset.filled = 'false'; },
    }, at);
  });
}
