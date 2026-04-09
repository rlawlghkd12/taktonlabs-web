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
    subtitle: '문제를 제대로 알기',
    body: '업무 흐름을 함께 걷고, 사용자의 실제 불편을 듣고, 숨겨진 요구사항을 발견합니다. 기술 선택은 그 다음입니다.',
    principles: [
      '기존 업무 관찰 (스크린 공유·인터뷰)',
      '진짜 고객(실사용자) 목소리 수집',
      '요구사항 정리 문서로 합의',
    ],
  },
  {
    index: '02',
    labelLatin: 'DESIGN',
    labelKo: '설계',
    subtitle: '구조가 결과를 결정한다',
    body: '화면보다 먼저 데이터 모델과 API 경계를 잡습니다. 탄탄한 설계가 유지보수 10년의 비용을 결정합니다.',
    principles: [
      '데이터 모델 먼저, UI는 그 다음',
      '확장 포인트 미리 설계',
      '실제 사용자와 UI 프로토타입 검증',
    ],
  },
  {
    index: '03',
    labelLatin: 'BUILD',
    labelKo: '개발',
    subtitle: '한 번에 올바르게',
    body: '검증된 기술과 모범 사례로 느리지만 확실하게 만듭니다. 테스트 없는 코드는 출시하지 않습니다.',
    principles: [
      '매일 빌드 가능한 상태 유지',
      '테스트 커버리지 80% 이상',
      '주 1회 데모 · 고객 피드백 반영',
    ],
  },
  {
    index: '04',
    labelLatin: 'OPERATE',
    labelKo: '운영',
    subtitle: '출시는 시작입니다',
    body: '자동 업데이트, 모니터링, 빠른 대응. 문제가 생기기 전에 발견하고, 생겼을 땐 즉시 고칩니다.',
    principles: [
      '자동 에러 수집 (Sentry·로그)',
      '정기 백업 + 복구 테스트',
      '긴급 대응 1 영업일 이내',
    ],
  },
];
