# HANDOVER: 사업관리카드 파서 - Production Ready

## 프로젝트 개요

**프로젝트명**: 사업관리카드 파서
**목적**: 한국 학교 예산 관리용 엑셀 파일(사업관리카드)의 들여쓰기로 병합된 셀을 정규화된 테이블 형식으로 변환
**배포 URL**: https://budget-card-parser.vercel.app
**GitHub**: https://github.com/1000ssam/budget-card-parser
**상태**: ✅ Production Ready (v1.0.0)

## 기술 스택

- **Framework**: Next.js 15.5.12 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Pretendard Variable
- **Excel Parsing**: SheetJS (xlsx)
- **Deployment**: Vercel
- **Design System**: Accent color #D2886F, 콤팩트 UI, 반응형

## 주요 기능

### 1. 파일 업로드
- 드래그 앤 드롭 또는 클릭으로 .xls/.xlsx 파일 업로드
- 수평 레이아웃으로 콤팩트하게 구성 (아이콘 + 설명 + 버튼)
- 파일 선택 시 자동 파싱 시작
- 에러 발생 시 사용자 친화적 메시지 표시

### 2. 계층적 데이터 파싱
**핵심 로직**: `src/lib/parser.ts`

```typescript
// 주요 함수
- countLeadingSpaces(str: string): number
- findHeaderRow(sheet: XLSX.WorkSheet): number | null
- extractHeaders(sheet: XLSX.WorkSheet, headerRowIdx: number): string[]
- buildLevelMap(sheet: XLSX.WorkSheet, headerRowIdx: number): Map<number, number>
- parseWorkbook(workbook: XLSX.WorkBook): ParseResult
```

**파싱 알고리즘**:
1. 헤더 행 자동 감지 ("세부사업/세부항목/원가통계비목" 포함)
2. 고유 leading space 개수 수집 → 동적 레벨 맵 생성
3. 각 행 처리:
   - Leading space 개수로 레벨 결정
   - 상위 레벨 값을 컨텍스트에 저장 및 상속
   - 현재 레벨 값만 셀에 기록

**계층 구조** (샘플 파일 기준):
- Level 0: 합계 (공백 1개)
- Level 1: 세부사업 (공백 4개)
- Level 2: 세부항목 (공백 7개)
- Level 3: 원가통계비목 (공백 10개)

### 3. 테이블 표시 및 선택
**컴포넌트**: `src/components/DataTable.tsx`

- 체크박스로 개별 행 선택
- 전체 선택/해제 (indeterminate 상태 지원)
- 선택된 행 하이라이트 (`bg-[#D2886F]/10`)
- 스크롤 가능한 고정 헤더 (sticky)
- 콤팩트한 셀 크기 (`px-3 py-2`)
- 최대 높이 500px

### 4. 데이터 내보내기
**컴포넌트**: `src/components/Toolbar.tsx`

**기능**:
- 전체 복사/다운로드
- 선택 항목 복사/다운로드
- 총 행 수 및 선택된 행 수 표시

**포맷**:
- 복사: TSV (클립보드, 엑셀 붙여넣기 호환)
- 다운로드: XLSX (SheetJS 사용)

## 프로젝트 구조

```
budget-card-parser/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 메타데이터, OG 설정
│   │   ├── page.tsx             # 메인 페이지, 상태 관리
│   │   ├── globals.css          # 전역 스타일, 디자인 시스템
│   │   ├── opengraph-image.tsx  # OG 이미지 동적 생성 (PNG)
│   │   └── twitter-image.tsx    # Twitter Card 이미지
│   ├── components/
│   │   ├── DataTable.tsx        # 테이블 표시, 행 선택
│   │   ├── FileUploader.tsx     # 파일 업로드 UI (수평 레이아웃)
│   │   ├── Toolbar.tsx          # 복사/다운로드 버튼
│   │   └── Footer.tsx           # 카피라이트, SNS 링크
│   └── lib/
│       ├── parser.ts            # 핵심 파싱 로직
│       └── export.ts            # XLSX/TSV 변환
├── public/
│   └── favicon.svg              # 파비콘 (테이블 아이콘)
├── package.json
├── tsconfig.json                # paths: "@/*": ["./src/*"]
└── tailwind.config.ts
```

## 상태 관리 (`src/app/page.tsx`)

```typescript
const [parseResult, setParseResult] = useState<ParseResult | null>(null);
const [filename, setFilename] = useState<string>('');
const [error, setError] = useState<string>('');
const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

// 주요 핸들러
- handleFileLoad: 파일 업로드 → 파싱
- handleReset: 상태 초기화
- handleRowSelect: 개별 행 선택
- handleSelectAll: 전체 선택/해제
```

## 디자인 시스템

### 색상 (`src/app/globals.css`)
```css
--accent: #D2886F;           /* 메인 액센트 */
--text-primary: #171717;     /* 본문 텍스트 */
--text-secondary: #525252;   /* 보조 텍스트 */
--border: #e5e5e5;           /* 테두리 */
--background: #fafafa;       /* 배경 */
```

### 타이포그래피
- **폰트**: Pretendard Variable
- **제목**: text-2xl, font-light, tracking-[-0.02em]
- **본문**: text-xs, font-light, tracking-tight
- **반응형**: 모바일/태블릿/데스크톱 대응

### 레이아웃
- 최대 너비: 7xl (max-w-7xl)
- 패딩: py-6 px-4 (콤팩트)
- 중앙 정렬: mx-auto, flex items-center
- 간격: gap-2 ~ gap-4

## 환경 설정

### 개발 환경
```bash
npm install
npm run dev  # http://localhost:3000
```

### 빌드
```bash
npm run build
npm run start
```

### Vercel 배포
```bash
# 자동 배포 (main 브랜치 푸시 시)
git push origin main
```

## 알려진 제약사항

### 1. 파싱 조건
- 헤더 행에 "세부사업", "세부항목", "원가통계비목" 중 하나 필수
- Leading space로만 계층 구조 판단 (다른 방식 미지원)
- 2행 병합 헤더만 지원 (3행 이상 미지원)

### 2. 성능
- 대용량 파일 (1만 행 이상)에서 브라우저 성능 저하 가능
- 모든 파싱이 클라이언트 사이드에서 수행
- 서버 사이드 파싱 미지원

### 3. 브라우저 호환성
- 최신 Chrome, Safari, Firefox, Edge 지원
- IE 미지원 (Next.js 15+ 요구사항)

## 향후 개선 사항

### 우선순위 높음
1. **오류 리포팅**: 파싱 실패 시 파일 업로드하여 개발자에게 전송
2. **샘플 파일**: 사용자가 시험해볼 수 있는 샘플 제공
3. **파싱 알고리즘 개선**: 더 다양한 파일 형식 지원

### 우선순위 중간
4. **다국어 지원**: 영문 인터페이스 추가
5. **프리뷰 기능**: 업로드 전 파일 미리보기
6. **북마크 기능**: 자주 사용하는 파일 저장

### 우선순위 낮음
7. **테마 지원**: 다크 모드
8. **히스토리**: 최근 파싱한 파일 목록
9. **배치 처리**: 여러 파일 동시 업로드

## 배포 정보

### Vercel 설정
- **Project**: budget-card-parser
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Branch**: main (자동 배포)
- **Environment Variables**: 없음

### 도메인
- Production: https://budget-card-parser.vercel.app
- Preview: PR마다 자동 생성

## 메타데이터 및 SEO

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://budget-card-parser.vercel.app'),
  title: "사업관리카드 파서",
  description: "학교 예산 사업관리카드 엑셀 파일을 정규화된 테이블로 변환",
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: "사업관리카드 파서",
    description: "들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환합니다",
    url: "https://budget-card-parser.vercel.app",
    siteName: "사업관리카드 파서",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "사업관리카드 파서",
    description: "들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환합니다",
  },
};
```

## 트러블슈팅

### 파싱 실패
1. **헤더 행 확인**: "세부사업", "세부항목", "원가통계비목" 포함 여부
2. **들여쓰기 일관성**: 각 레벨이 일관된 공백 개수 사용하는지 확인
3. **파일 인코딩**: UTF-8 또는 EUC-KR 인코딩 확인
4. **병합 셀**: 2행 병합 헤더만 지원

### 빌드 에러
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 삭제
rm -rf .next
npm run build
```

### 타입 에러
```bash
# tsconfig.json의 paths 설정 확인
# "@/*": ["./src/*"]

# 타입 체크
npm run build
```

## Git 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
chore: 빌드 설정, 패키지 업데이트
design: UI/UX 개선
refactor: 코드 리팩토링
docs: 문서 수정

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## 주요 커밋 히스토리

1. **프로젝트 초기화**: Next.js 15.5.12, TypeScript, Tailwind CSS
2. **파싱 로직 구현**: 계층적 파싱 알고리즘 (`parser.ts`)
3. **UI 컴포넌트**: FileUploader, DataTable, Toolbar
4. **행 선택 기능**: 체크박스 선택, 전체 선택/해제
5. **디자인 시스템 적용**: Pretendard Variable, accent color
6. **콤팩트 UI**: 모든 요소 크기 축소, 반응형 적용
7. **푸터 추가**: 카피라이트, SNS 링크
8. **OG 이미지**: ImageResponse로 PNG 동적 생성
9. **브랜딩 업데이트**: 1000ssam → 1000쌤

## 연락처 및 링크

- **개발자**: 1000쌤
- **GitHub**: https://github.com/1000ssam
- **Homepage**: https://www.notiontalk.com
- **Instagram**: @iooo_tttt
- **Threads**: @iooo_tttt

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [SheetJS Documentation](https://docs.sheetjs.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Pretendard Font](https://github.com/orioncactus/pretendard)

---

**Last Updated**: 2026-02-13
**Version**: 1.0.0
**Status**: Production Ready ✅
**Next Session**: 향후 개선 사항 우선순위대로 진행
