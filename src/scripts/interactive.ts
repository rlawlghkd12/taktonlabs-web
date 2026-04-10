/**
 * 인터랙티브 마이크로 효과.
 * - 카드 3D 틸트 (마우스 추적)
 * - CTA 버튼 마그네틱
 * - 커서 스포트라이트 (히어로)
 */

import { hasHover } from './motion-guards';

// ========== Card 3D Tilt ==========

function initCardTilt(): void {
  if (!hasHover()) return;

  const cards = document.querySelectorAll<HTMLElement>(
    '[data-philosophy-card], [data-why-card], .capability-card'
  );

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });
}

// ========== Magnetic Buttons ==========

function initMagneticButtons(): void {
  if (!hasHover()) return;

  const buttons = document.querySelectorAll<HTMLElement>('.cta, .faq-trigger');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
      setTimeout(() => {
        btn.style.transition = '';
      }, 400);
    });
  });
}

// ========== Hero Spotlight (커서 따라 그라디언트 이동) ==========

function initHeroSpotlight(): void {
  if (!hasHover()) return;

  const hero = document.querySelector<HTMLElement>('.hero-bg-mesh');
  if (!hero) return;

  const section = document.querySelector<HTMLElement>('#hero');
  if (!section) return;

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    hero.style.background = `
      radial-gradient(ellipse 50% 40% at ${x}% ${y}%, rgba(8, 145, 178, 0.06), transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%, rgba(8, 145, 178, 0.03), transparent 50%)
    `;
  });

  section.addEventListener('mouseleave', () => {
    hero.style.background = '';
  });
}

// ========== Export ==========

export function initInteractive(): void {
  initCardTilt();
  initMagneticButtons();
  initHeroSpotlight();
}
