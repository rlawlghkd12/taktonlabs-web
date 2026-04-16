export function initFaq(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-faq-item]');
  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('[data-faq-trigger]');
    const answer = item.querySelector<HTMLElement>('[data-faq-answer]');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      // close all others (one-at-a-time)
      items.forEach((other) => {
        if (other === item) return;
        other.dataset.open = 'false';
        other.querySelector<HTMLElement>('[data-faq-answer]')!.style.maxHeight = '0';
        other.querySelector<HTMLButtonElement>('[data-faq-trigger]')!.setAttribute('aria-expanded', 'false');
      });
      if (isOpen) {
        item.dataset.open = 'false';
        answer.style.maxHeight = '0';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.dataset.open = 'true';
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
