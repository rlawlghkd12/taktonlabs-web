import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isDesktop } from './motion-guards';
import { getLenis } from './smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

// ========== GSAP 전역 기본값 (부드러움 축) ==========
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// ========== ScrollTrigger 모바일 안정화 ==========
// iOS Safari 의 browser chrome 숨김/표시 시 refresh 를 방지해 점프 제거
ScrollTrigger.config({ ignoreMobileResize: true });

// Lenis와 ScrollTrigger 동기화
function syncLenisWithScrollTrigger() {
  const lenis = getLenis();
  if (!lenis) return;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/**
 * 모든 스크롤 애니메이션 진입점. DOM 로드 후 호출.
 */
export function initScrollAnimations(): void {
  if (prefersReducedMotion()) {
    // reduced-motion: 모든 요소 즉시 완료 상태로 표시 (레이아웃 유지)
    showAllImmediately();
    return;
  }

  syncLenisWithScrollTrigger();

  animateHero();
  animateSectionHeaders();
  animateCapabilities();
  animateProductsSection();
  animateContact();
}

/**
 * reduced-motion 폴백: 숨겨진 요소들을 즉시 표시.
 */
function showAllImmediately(): void {
  // Hero 단어
  gsap.set('.word', { opacity: 1, y: 0 });
  // 앱 윈도우
  gsap.set('[data-window]', { opacity: 1, scale: 1 });
  // 민트 라인
  gsap.set('[data-mint-line]', { scaleX: 1 });
  // Reveal 대상
  gsap.set('[data-reveal]', { opacity: 1, y: 0 });
}

/**
 * Hero: 단어 단위 페이드인 + 서브카피/CTA stagger
 */
function animateHero(): void {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 단어 stagger
  tl.from('.headline .word', {
    y: 16,
    opacity: 0,
    duration: 0.9,
    stagger: 0.08,
  });

  // 서브카피
  tl.from(
    '.subcopy',
    {
      y: 16,
      opacity: 0,
      duration: 0.8,
    },
    '+=0.2'
  );

  // CTA 2개
  tl.from(
    '.ctas .cta',
    {
      y: 12,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
    },
    '-=0.4'
  );

  // 헥사곤 (등장)
  tl.from(
    '.hero-hexagon svg',
    {
      opacity: 0,
      scale: 1.2,
      duration: 1.2,
      ease: 'power2.out',
    },
    0.1
  );
}

/**
 * 섹션 헤더 (라벨/제목/서브카피): 진입 시 fade + slide up
 */
function animateSectionHeaders(): void {
  const headers = document.querySelectorAll(
    '#capabilities .capabilities-header, #products .products-header, #contact .contact-header'
  );

  headers.forEach((header) => {
    gsap.from(header.children, {
      y: 24,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

/**
 * 핵심 역량: 데스크톱은 pin + 순차 활성화, 모바일은 IntersectionObserver 진입
 */
function animateCapabilities(): void {
  const section = document.querySelector('#capabilities');
  const cards = document.querySelectorAll<HTMLElement>('.capability-card');
  if (!section || cards.length === 0) return;

  if (isDesktop()) {
    // 데스크톱: pin + 스크롤 진행도에 따라 카드 순차 활성화
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: '+=150%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, i) => {
      tl.call(() => {
        cards.forEach((c, j) => {
          if (j === i) {
            c.setAttribute('data-active', 'true');
            c.removeAttribute('data-dimmed');
          } else {
            c.removeAttribute('data-active');
            c.setAttribute('data-dimmed', 'true');
          }
        });
      }, [], i * 0.33);
    });

    // 섹션 끝: 모든 카드 정상 복귀
    tl.call(() => {
      cards.forEach((c) => {
        c.removeAttribute('data-active');
        c.removeAttribute('data-dimmed');
      });
    }, [], 1);
  } else {
    // 모바일: IntersectionObserver 진입 애니메이션
    cards.forEach((card) => {
      gsap.from(card, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }
}

/**
 * 제품 섹션: 라이트→다크 body 배경 전환 + 민트 라인 draw-in + 앱 윈도우 stagger reveal
 */
function animateProductsSection(): void {
  const section = document.querySelector('#products');
  if (!section) return;

  // 라이트→다크 body 배경 전환 (섹션 중앙 도달 시)
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'top 20%',
    onEnter: () => {
      gsap.to('body', {
        backgroundColor: '#0a1929',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
    onLeaveBack: () => {
      gsap.to('body', {
        backgroundColor: '#fafaf9',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
  });

  // 민트 라인 draw-in (좌→우)
  gsap.set('[data-mint-line]', { scaleX: 0 });
  gsap.to('[data-mint-line]', {
    scaleX: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

  // 앱 윈도우 scale + fade in
  gsap.to('[data-window]', {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  // 창 헤더 dots stagger (stage 2: 60ms)
  gsap.from('[data-window-dot]', {
    opacity: 0,
    scale: 0.5,
    duration: 0.4,
    stagger: 0.06,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.3,
  });

  // 윈도우 내부 섹션 stagger (stage 3: 80ms)
  gsap.from('[data-window-section]', {
    opacity: 0,
    y: 8,
    duration: 0.6,
    stagger: 0.08,
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.5,
  });

  // stat-card stagger
  gsap.from('[data-window-card]', {
    opacity: 0,
    y: 6,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.7,
  });

  // list row stagger
  gsap.from('[data-window-row]', {
    opacity: 0,
    x: -4,
    duration: 0.4,
    stagger: 0.08,
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    delay: 1.0,
  });

  // 태그 칩 pop-in
  gsap.from('[data-tag]', {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    stagger: 0.06,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '[data-window]',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.5,
  });

  // ProductCard 정보 영역 reveal 요소들
  gsap.from('[data-reveal]', {
    opacity: 0,
    y: 16,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.product-card',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });
}

/**
 * 문의 섹션: 다크→라이트 배경 복귀 + 카드 진입
 */
function animateContact(): void {
  const section = document.querySelector('#contact');
  if (!section) return;

  // 다크→라이트 body 배경 복귀
  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'top 30%',
    onEnter: () => {
      gsap.to('body', {
        backgroundColor: '#fafaf9',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
    onLeaveBack: () => {
      gsap.to('body', {
        backgroundColor: '#0a1929',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    },
  });

  // 카드 진입
  gsap.from('#contact .card', {
    y: 32,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '#contact .contact-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}
