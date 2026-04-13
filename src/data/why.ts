/**
 * Taktonlabs 의 4 가지 약속 (외주 공포 해소).
 * Why Takton Labs 섹션에서 사용.
 */

export interface WhyPromise {
  index: string;
  /** Lucide 아이콘 이름 */
  iconName: string;
  title: string;
  body: string;
}

export const whyPromises: WhyPromise[] = [
  {
    index: '01',
    iconName: 'lucide:infinity',
    title: '만든 사람이 끝까지 함께합니다',
    body: '기획한 사람, 설계한 사람, 코드를 짠 사람이 출시 후에도 같은 자리에 있습니다. 인수인계로 생기는 공백이 없습니다. 연락이 끊기는 일도 없습니다.',
  },
  {
    index: '02',
    iconName: 'lucide:unlock',
    title: '데이터는 완전히 당신의 것',
    body: 'Excel, CSV, SQL 덤프. 언제든 원하는 형식으로 내보낼 수 있습니다. 특정 플랫폼에 잠기지 않도록 설계부터 신경 씁니다.',
  },
  {
    index: '03',
    iconName: 'lucide:receipt',
    title: '숨겨진 비용 없는 유지보수',
    body: '월 정액 유지보수 옵션. 작은 수정도, 긴급 장애 대응도 추가 비용 없이. 큰 기능 추가만 별도 견적입니다.',
  },
  {
    index: '04',
    iconName: 'lucide:package',
    title: '소스코드 완전 양도',
    body: 'GitHub 프라이빗 레포 전체를 이관해드립니다. 다른 개발사에 맡기고 싶을 때, 내부 개발팀이 생겼을 때, 자유롭게 선택할 수 있습니다.',
  },
];
