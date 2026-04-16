// src/data/why.ts

export interface WhyPromise {
  index: '01' | '02' | '03' | '04';
  category: string;
  title: string;
  body: string;
}

export const whyPromises: WhyPromise[] = [
  {
    index: '01',
    category: '지속성',
    title: '만든 사람이 끝까지 함께합니다',
    body: '기획한 사람, 설계한 사람, 코드를 짠 사람이 출시 후에도 같은 자리에 있습니다. 인수인계로 생기는 공백이 없습니다. 연락이 끊기는 일도 없습니다.',
  },
  {
    index: '02',
    category: '개방성',
    title: '데이터는 완전히 당신의 것',
    body: '엑셀, CSV 등 원하는 형식으로 언제든 내보낼 수 있습니다. 특정 플랫폼에 잠기지 않도록 설계부터 신경 씁니다.',
  },
  {
    index: '03',
    category: '투명성',
    title: '투명한 비용, 명확한 기준',
    body: '유지보수 방식과 비용은 프로젝트에 맞게 상담 후 결정합니다. 숨겨진 비용 없이, 사전에 합의한 범위 안에서 진행합니다.',
  },
  {
    index: '04',
    category: '접근성',
    title: '물어볼 곳이 있다는 안심',
    body: '사용 중 궁금한 점이 생기면 바로 연락할 수 있습니다. 매뉴얼만 던져주고 끝나는 게 아니라, 익숙해질 때까지 함께합니다.',
  },
];
