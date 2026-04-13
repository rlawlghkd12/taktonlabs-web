/**
 * FAQ 아코디언 클릭 핸들러.
 * - 클릭 또는 Enter/Space 키로 토글
 * - aria-expanded / data-open 상태 동기화
 * - max-height 애니메이션 (scrollHeight 기반)
 */

export function initFaq(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-faq-item]');

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-faq-trigger]');
    const answer = item.querySelector<HTMLElement>('[data-faq-answer]');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      if (isOpen) {
        closeItem(item, trigger, answer);
      } else {
        openItem(item, trigger, answer);
      }
    });
  });
}

function openItem(
  item: HTMLElement,
  trigger: HTMLButtonElement,
  answer: HTMLElement
): void {
  item.setAttribute('data-open', 'true');
  trigger.setAttribute('aria-expanded', 'true');
  answer.style.maxHeight = answer.scrollHeight + 'px';
}

function closeItem(
  item: HTMLElement,
  trigger: HTMLButtonElement,
  answer: HTMLElement
): void {
  item.removeAttribute('data-open');
  trigger.setAttribute('aria-expanded', 'false');
  answer.style.maxHeight = '0';
}
