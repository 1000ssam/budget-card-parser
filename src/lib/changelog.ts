export interface ChangelogEntry {
  version: string;
  date: string;
  sections: {
    type: 'added' | 'changed' | 'fixed';
    label: string;
    items: string[];
  }[];
}

export const APP_VERSION = 'v1.1.0';

export const changelog: ChangelogEntry[] = [
  {
    version: 'v1.1.0',
    date: '2026-03-07',
    sections: [
      {
        type: 'added',
        label: '새 기능',
        items: [
          '복사 시 헤더 포함/미포함 옵션 추가',
        ],
      },
      {
        type: 'fixed',
        label: '버그 수정',
        items: [
          '1개 행 선택 시 Notion 붙여넣기가 안 되던 문제 수정 (HTML 테이블 복사)',
          '헤더 포함 기본값을 OFF로 변경',
          '툴바 버튼 순서 재정렬 (다운로드 우선)',
        ],
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-02-13',
    sections: [
      {
        type: 'added',
        label: '새 기능',
        items: [
          '엑셀 파일(.xls/.xlsx) 드래그 앤 드롭 업로드',
          '들여쓰기 기반 계층적 데이터 자동 파싱',
          '체크박스 행 선택 (개별/전체)',
          '클립보드 복사 (TSV) 및 XLSX 다운로드',
          'OG 이미지 및 메타데이터 설정',
        ],
      },
    ],
  },
];
