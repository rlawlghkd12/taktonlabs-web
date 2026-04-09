import { prefersReducedMotion, hasHover } from './motion-guards';

/**
 * Hero 헥사곤 마우스 패럴럭스 (lerp 보간).
 * 데스크톱 + hover 디바이스 only. reduced-motion 시 비활성.
 */
export function initHexagonInteractive(): void {
  if (prefersReducedMotion() || !hasHover()) return;

  const hexagon = document.querySelector<HTMLElement>('.hero-hexagon');
  if (!hexagon) return;

  const svg = hexagon.querySelector<SVGElement>('svg');
  if (!svg) return;

  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  const maxRotY = 8;
  const maxRotX = 5;
  const lerpFactor = 0.08;

  function handleMouseMove(e: MouseEvent): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const relX = (e.clientX / vw) * 2 - 1; // -1 ~ 1
    const relY = (e.clientY / vh) * 2 - 1;
    targetRotY = relX * maxRotY;
    targetRotX = -relY * maxRotX;
  }

  function animate(): void {
    currentRotX += (targetRotX - currentRotX) * lerpFactor;
    currentRotY += (targetRotY - currentRotY) * lerpFactor;
    svg!.style.transform = `translate3d(0, 0, 0) rotateY(${currentRotY}deg) rotateX(${currentRotX}deg)`;
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  requestAnimationFrame(animate);
}
