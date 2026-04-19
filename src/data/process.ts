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
    body: '현재 업무를 함께 살펴보고, 정말 필요한 것만 추려냅니다.',
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
    body: '구조부터 먼저. 처음 잘 잡으면 이후 수정·확장 비용이 줄어듭니다.',
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
    body: '검증된 방법으로 동작 확인하며 쌓아 올립니다.',
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
    body: '자동 업데이트와 오류 감지. 문제는 생기기 전에 잡습니다.',
    principles: [
      '오류 자동 감지 · 즉시 알림',
      '정기 백업으로 데이터 안전 보장',
      '긴급 문제 발생 시 1 영업일 이내 대응',
    ],
  },
];
