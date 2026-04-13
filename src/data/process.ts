/**
 * Taktonlabs 프로젝트 진행 4 단계 (이해 → 설계 → 개발 → 운영).
 * Process 섹션에서 사용.
 */

export interface ProcessStep {
  /** 01, 02, 03, 04 */
  index: string;
  /** 영문 라벨 */
  labelLatin: string;
  /** 한글 라벨 */
  labelKo: string;
  /** 부제 */
  subtitle: string;
  /** 본문 카피 */
  body: string;
  /** 원칙 3개 (작은 bullet) */
  principles: string[];
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    labelLatin: 'DISCOVER',
    labelKo: '이해',
    subtitle: '먼저 듣고, 직접 봅니다',
    body: '현재 업무가 어떻게 돌아가는지 함께 살펴봅니다. 불편한 점, 시간이 오래 걸리는 부분을 찾아내고, 정말 필요한 것이 무엇인지 정리합니다.',
    principles: [
      '화면을 함께 보며 현재 업무 흐름 파악',
      '실제 사용자의 불편 사항 수집',
      '필요한 기능을 문서로 정리하고 합의',
    ],
  },
  {
    index: '02',
    labelLatin: 'DESIGN',
    labelKo: '설계',
    subtitle: '기초 공사가 튼튼해야 합니다',
    body: '화면을 그리기 전에 전체 구조를 먼저 잡습니다. 처음부터 잘 설계하면 나중에 수정하거나 기능을 추가할 때 비용이 크게 줄어듭니다.',
    principles: [
      '전체 구조를 먼저 그리고, 화면은 그 다음',
      '나중에 기능을 추가하기 쉽게 설계',
      '실제 사용자와 함께 화면 시안 검증',
    ],
  },
  {
    index: '03',
    labelLatin: 'BUILD',
    labelKo: '개발',
    subtitle: '빠르게보다, 정확하게',
    body: '검증된 방법으로 꼼꼼하게 만듭니다. 만든 기능이 제대로 작동하는지 반드시 확인한 뒤 다음 단계로 넘어갑니다.',
    principles: [
      '항상 동작하는 상태를 유지하며 개발',
      '매 기능마다 정상 작동 검증',
      '주 1회 진행 상황 공유 · 피드백 반영',
    ],
  },
  {
    index: '04',
    labelLatin: 'OPERATE',
    labelKo: '운영',
    subtitle: '출시는 시작입니다',
    body: '프로그램이 항상 최신 상태를 유지하도록 자동 업데이트합니다. 문제가 생기기 전에 감지하고, 생겼을 때는 빠르게 대응합니다.',
    principles: [
      '오류 자동 감지 · 즉시 알림',
      '정기 백업으로 데이터 안전 보장',
      '긴급 문제 발생 시 1 영업일 이내 대응',
    ],
  },
];
