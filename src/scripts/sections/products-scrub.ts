// src/scripts/sections/products-scrub.ts
// Products 섹션 — pin된 280vh 레일 안에서 스크롤 진행도에 따라
// 3개 화면/캡션이 단계적으로 전환된다 (타이머 X).
// reduced-motion 또는 모바일 뷰포트에서는 pin 해제 후 모든 화면을 펼쳐 보임.

import { prefersReducedMotion, isDesktopViewport } from '../../lib/motion';

export async function initProductsScrub(): Promise<void> {
  const section = document.querySelector<HTMLElement>('#products');
  if (!section) return;

  // ===== reduced-motion: 완전 정적 (모든 화면/캡션 펼쳐 보임) =====
  if (prefersReducedMotion()) {
    const pin = section.querySelector<HTMLElement>('.prod-pin');
    if (pin) {
      pin.style.position = 'static';
      pin.style.height = 'auto';
      pin.style.minHeight = 'auto';
    }
    const rail = section.querySelector<HTMLElement>('[data-prod-rail]');
    if (rail) rail.style.height = 'auto';
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

  // ===== 모바일/태블릿(<1024px): sticky window + 캡션 스크롤 추적 =====
  // 윈도우는 위쪽에 sticky로 고정. 캡션들은 세로 stack으로 흐름.
  // 사용자가 스크롤하면 IntersectionObserver가 가장 가까운 캡션을 감지해
  // 윈도우 스크린 / 헤더 / progress / indicator를 동기화한다. (타이머 X)
  if (!isDesktopViewport()) {
    const pin = section.querySelector<HTMLElement>('.prod-pin');
    if (pin) {
      pin.style.position = 'static';
      pin.style.height = 'auto';
      pin.style.minHeight = 'auto';
    }
    const rail = section.querySelector<HTMLElement>('[data-prod-rail]');
    if (rail) rail.style.height = 'auto';

    const screens = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-screen]'));
    const captions = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-caption]'));
    const indicators = Array.from(section.querySelectorAll<HTMLElement>('[data-prod-indicator]'));
    const progressSegs = Array.from(section.querySelectorAll<HTMLElement>('.prod-progress .seg'));
    const windowTitleItems = Array.from(
      section.querySelectorAll<HTMLElement>('.window-title-stack .window-title'),
    );
    const frameCurrent = section.querySelector<HTMLElement>('[data-prod-frame-current]');
    const indicatorList = section.querySelector<HTMLElement>('.prod-indicators');

    // 모바일 indicator를 가로 dot row로 (CSS hook)
    if (indicatorList) indicatorList.setAttribute('data-mobile', 'true');

    const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const SMOOTH = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

    // 윈도우 안 화면들: absolute로 겹치게 두고 opacity로 전환
    screens.forEach((s, i) => {
      s.style.position = i === 0 ? 'relative' : 'absolute';
      s.style.inset = i === 0 ? 'auto' : '10px';
      s.style.opacity = i === 0 ? '1' : '0';
      s.style.transform = i === 0 ? 'scale(1)' : 'scale(1.02)';
      s.style.transition = `opacity 0.5s ${EXPO}, transform 0.5s ${EXPO}`;
      s.style.willChange = 'opacity, transform';
    });

    // 캡션들은 스크롤 추적 대상 — 세로로 자연 stack 그대로 둠.
    // CSS 모바일 룰을 안 건드리지만, 추적용 데이터 속성/식별만 부여.
    captions.forEach((c) => {
      c.style.opacity = '';
      c.style.transform = '';
    });

    windowTitleItems.forEach((el) => {
      el.style.transition = `opacity 0.4s ${SMOOTH}`;
    });

    let lastIdx = -1;
    function showIndex(idx: number): void {
      if (idx === lastIdx) return;
      lastIdx = idx;
      screens.forEach((s, i) => {
        s.style.opacity = i === idx ? '1' : '0';
        s.style.transform = i === idx ? 'scale(1)' : 'scale(1.02)';
      });
      windowTitleItems.forEach((el, i) => {
        el.style.opacity = i === idx ? '1' : '0';
      });
      indicators.forEach((el, i) => {
        el.dataset.active = String(i === idx);
      });
      progressSegs.forEach((seg, i) => {
        seg.dataset.filled = String(i <= idx);
      });
      if (frameCurrent) frameCurrent.textContent = String(idx + 1).padStart(2, '0');
      // 활성 캡션 강조 (다른 캡션 dim)
      captions.forEach((c, i) => {
        c.style.transition = `opacity 0.4s ${SMOOTH}`;
        c.style.opacity = i === idx ? '1' : '0.32';
      });
    }

    showIndex(0);

    // 캡션 스크롤 추적: 각 캡션의 viewport 위치를 측정해
    // 윈도우 sticky 영역 바로 아래에 가장 가까운 캡션 인덱스를 active로.
    let ticking = false;
    function update(): void {
      ticking = false;
      // 윈도우 sticky 하단 y (대략 nav 80 + window height 정도) — viewport 1/2 지점을 anchor로 사용
      const anchorY = window.innerHeight * 0.55;
      let bestIdx = 0;
      let bestDist = Infinity;
      captions.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - anchorY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      showIndex(bestIdx);
    }
    function onScroll(): void {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    let attached = false;
    function attach(): void {
      if (attached) return;
      attached = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
    }
    function detach(): void {
      if (!attached) return;
      attached = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) attach();
          else detach();
        });
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(section);

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
  const frameCurrent = section.querySelector<HTMLElement>('[data-prod-frame-current]');

  // Sticky pin 설정 — 레일 안에서 280vh 동안 고정
  rail.style.height = '280vh';
  pinEl.style.position = 'sticky';
  pinEl.style.top = '0';
  pinEl.style.height = '100vh';

  // CSS transitions — idx 전환 시 부드러운 페이드
  const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const SMOOTH = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
  screens.forEach((s) => {
    s.style.transition = `opacity 0.55s ${EXPO}, transform 0.55s ${EXPO}`;
    s.style.willChange = 'opacity, transform';
  });
  captions.forEach((c) => {
    c.style.transition = `opacity 0.45s ${SMOOTH}, transform 0.45s ${SMOOTH}`;
    c.style.willChange = 'opacity, transform';
  });
  windowTitleItems.forEach((el) => {
    el.style.transition = `opacity 0.4s ${SMOOTH}`;
  });
  indicators.forEach((el) => {
    el.style.transition = `opacity 0.3s ${SMOOTH}`;
  });

  let lastIdx = -1;
  function showIndex(idx: number): void {
    if (idx === lastIdx) return;
    lastIdx = idx;
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
    if (frameCurrent) {
      frameCurrent.textContent = String(idx + 1).padStart(2, '0');
    }
  }

  // 초기 상태
  showIndex(0);

  // ===== 스크롤 진행도 → idx 매핑 =====
  // rail이 280vh, pin이 100vh이므로 scrollable distance = 180vh.
  // progress 0~1 을 [0, 0.5, 1] 임계값으로 3분할:
  //   p < 1/3 → idx 0
  //   p < 2/3 → idx 1
  //   else    → idx 2
  // 진입/이탈 시 약간의 dead zone 을 둬서 첫/마지막 화면이 안정적으로 보이게 함.
  const N = 3;
  let ticking = false;

  function update(): void {
    ticking = false;
    const railRect = rail.getBoundingClientRect();
    const railHeight = rail.offsetHeight;
    const pinHeight = window.innerHeight;
    const scrollable = railHeight - pinHeight;
    if (scrollable <= 0) {
      showIndex(0);
      return;
    }
    // rail.top 이 0 이면 scrolled = 0, rail.top = -scrollable 이면 scrolled = scrollable
    const scrolled = -railRect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollable));
    // 3 단계 분할 — 약간의 안쪽 마진(0.05)으로 끝/시작 화면 안정 표시
    let idx: number;
    if (progress < 1 / N) idx = 0;
    else if (progress < 2 / N) idx = 1;
    else idx = 2;
    showIndex(idx);
  }

  function onScroll(): void {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  // 섹션 가시 영역 안에서만 listener 부착 (성능)
  let attached = false;
  function attach(): void {
    if (attached) return;
    attached = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }
  function detach(): void {
    if (!attached) return;
    attached = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) attach();
        else detach();
      });
    },
    { rootMargin: '100px 0px' },
  );
  observer.observe(rail);
}
