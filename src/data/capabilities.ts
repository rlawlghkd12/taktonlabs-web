// src/data/capabilities.ts

export type ProofType = 'browser' | 'native-window' | 'dashboard-tiles';

export interface Capability {
  index: '01' | '02' | '03';
  slug: string;
  labelLatin: string;
  title: string;
  description: string;
  principles: string[];
  proofType: ProofType;
}

export const capabilities: Capability[] = [
  {
    index: '01',
    slug: 'web',
    labelLatin: 'WEB · MOBILE',
    title: '웹 · 모바일 제품',
    description:
      '홈페이지, 예약 시스템, 관리 페이지. 기획부터 배포까지 한 팀에서. PC·태블릿·스마트폰 어디서든.',
    principles: ['반응형 웹', '예약 · 결제 연동', 'SEO 최적화'],
    proofType: 'browser',
  },
  {
    index: '02',
    slug: 'desktop',
    labelLatin: 'DESKTOP APP',
    title: '데스크톱 앱',
    description:
      'Windows와 macOS에서 동시에 작동. 자동 업데이트, 오프라인 지원. TutorMate가 이 방식으로 매일 운영 중.',
    principles: ['Electron 기반 크로스플랫폼', '자동 업데이트', '오프라인 동작'],
    proofType: 'native-window',
  },
  {
    index: '03',
    slug: 'b2b',
    labelLatin: 'B2B CUSTOM',
    title: 'B2B 맞춤 개발',
    description:
      '업무 흐름을 직접 보고 만듭니다. 엑셀 반복을 한 화면으로, 수작업을 자동으로.',
    principles: ['기존 데이터 이관', '대시보드', '자동화 · 리포트'],
    proofType: 'dashboard-tiles',
  },
];
