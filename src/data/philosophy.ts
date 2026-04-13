/**
 * Taktonlabs 의 3 가지 브랜드 약속 (신뢰성 · 명확성 · 지속성).
 * 브랜드 가이드 문서에서 추출. Philosophy 섹션에서 사용.
 */

export interface PhilosophyValue {
  /** 01, 02, 03 */
  index: string;
  /** 영문 라벨 (Geist 로 렌더링) */
  labelLatin: string;
  /** 한글 라벨 */
  labelKo: string;
  /** 키워드 제목 */
  title: string;
  /** 본문 카피 (2~3 문장) */
  body: string;
  /** 본문에서 하이라이트할 핵심 단어 */
  highlight: string;
}

export const philosophyValues: PhilosophyValue[] = [
  {
    index: '01',
    labelLatin: 'RELIABILITY',
    labelKo: '신뢰성',
    title: '튼튼한 장부처럼',
    body: '한 명의 회원도, 한 건의 수납도 놓치지 않습니다. 데이터는 안전하게 보관되고, 언제든 정확히 복원됩니다. 편리함을 위해 신뢰를 타협하지 않습니다.',
    highlight: '장부처럼',
  },
  {
    index: '02',
    labelLatin: 'CLARITY',
    labelKo: '명확성',
    title: '한눈에 보이는 지표',
    body: '누가 미납했는지, 이번 달 매출은 얼마인지. 복잡한 숫자를 단순한 대시보드로. 판단에 필요한 정보만, 필요한 순간에 드러납니다.',
    highlight: '한눈에',
  },
  {
    index: '03',
    labelLatin: 'SUSTAINABILITY',
    labelKo: '지속성',
    title: '함께 성장하는 파트너',
    body: '일시적인 도구가 아닙니다. 비즈니스가 자라면 소프트웨어도 함께 자라야 합니다. 긴 호흡으로 파트너가 되는 것이 목표입니다.',
    highlight: '파트너',
  },
];
