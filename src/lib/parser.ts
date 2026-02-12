import * as XLSX from 'xlsx';

export interface ParsedRow {
  세부사업: string;
  세부항목: string;
  원가통계비목: string;
  [key: string]: string | number;
}

export interface ParseResult {
  headers: string[];
  rows: ParsedRow[];
}

/**
 * 문자열의 선행 공백 개수를 반환
 */
function countLeadingSpaces(str: string): number {
  if (typeof str !== 'string') return 0;
  const match = str.match(/^( *)/);
  return match ? match[1].length : 0;
}

/**
 * 헤더 행을 자동 감지 (세부사업/세부항목/원가통계비목 텍스트 포함)
 */
function findHeaderRow(sheet: XLSX.WorkSheet): number | null {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');

  for (let rowIdx = range.s.r; rowIdx <= range.e.r; rowIdx++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: 0 });
    const cell = sheet[cellAddress];

    if (cell && cell.v && typeof cell.v === 'string') {
      const text = cell.v.toLowerCase();
      if (text.includes('세부사업') || text.includes('세부항목') || text.includes('원가통계비목')) {
        return rowIdx;
      }
    }
  }

  return null;
}

/**
 * 헤더 추출 (2행 병합 구조 지원)
 */
function extractHeaders(sheet: XLSX.WorkSheet, headerRowIdx: number): string[] {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const headers: string[] = [];

  // 첫 번째 컬럼은 "세부사업/세부항목/원가통계비목"으로 고정
  headers.push('병합컬럼');

  // 나머지 컬럼 추출
  for (let colIdx = 1; colIdx <= range.e.c; colIdx++) {
    const cell1Address = XLSX.utils.encode_cell({ r: headerRowIdx, c: colIdx });
    const cell2Address = XLSX.utils.encode_cell({ r: headerRowIdx + 1, c: colIdx });

    const cell1 = sheet[cell1Address];
    const cell2 = sheet[cell2Address];

    let headerText = '';

    if (cell1 && cell1.v) {
      headerText = String(cell1.v).trim();
    }

    if (cell2 && cell2.v) {
      const subText = String(cell2.v).trim();
      if (subText && subText !== headerText) {
        headerText += subText ? ` ${subText}` : '';
      }
    }

    headers.push(headerText || `컬럼${colIdx}`);
  }

  return headers;
}

/**
 * 들여쓰기 레벨 맵 생성 (공백 수 → 레벨)
 */
function buildLevelMap(sheet: XLSX.WorkSheet, headerRowIdx: number): Map<number, number> {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const spaceCounts = new Set<number>();

  // 헤더 이후 모든 A열 데이터의 선행 공백 수집
  for (let rowIdx = headerRowIdx + 2; rowIdx <= range.e.r; rowIdx++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: 0 });
    const cell = sheet[cellAddress];

    if (cell && cell.v && typeof cell.v === 'string') {
      const spaceCount = countLeadingSpaces(cell.v);
      spaceCounts.add(spaceCount);
    }
  }

  // 공백 수를 정렬하여 레벨로 매핑
  const sortedSpaces = Array.from(spaceCounts).sort((a, b) => a - b);
  const levelMap = new Map<number, number>();

  sortedSpaces.forEach((spaceCount, idx) => {
    levelMap.set(spaceCount, idx);
  });

  return levelMap;
}

/**
 * 워크북을 파싱하여 정규화된 데이터 반환
 */
export function parseWorkbook(workbook: XLSX.WorkBook): ParseResult {
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  if (!sheet) {
    throw new Error('워크시트를 찾을 수 없습니다.');
  }

  // 1. 헤더 행 찾기
  const headerRowIdx = findHeaderRow(sheet);
  if (headerRowIdx === null) {
    throw new Error('헤더를 찾을 수 없습니다. "세부사업", "세부항목", "원가통계비목" 텍스트가 포함된 행이 필요합니다.');
  }

  // 2. 헤더 추출
  const originalHeaders = extractHeaders(sheet, headerRowIdx);

  // 3. 들여쓰기 레벨 맵 생성
  const levelMap = buildLevelMap(sheet, headerRowIdx);

  // 4. 데이터 행 파싱
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const rows: ParsedRow[] = [];

  // 상위 레벨 context 유지
  let currentContext = {
    세부사업: '',
    세부항목: '',
    원가통계비목: ''
  };

  // 데이터 시작은 헤더 + 1행 (2행 병합 헤더이므로 +2)
  for (let rowIdx = headerRowIdx + 2; rowIdx <= range.e.r; rowIdx++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: 0 });
    const cell = sheet[cellAddress];

    if (!cell || !cell.v) continue;

    const rawValue = String(cell.v);
    const spaceCount = countLeadingSpaces(rawValue);
    const level = levelMap.get(spaceCount) ?? 0;
    const trimmedValue = rawValue.trim();

    // 레벨에 따라 context 업데이트
    if (level === 0) {
      // 합계 행 - 스킵
      continue;
    } else if (level === 1) {
      currentContext.세부사업 = trimmedValue;
      currentContext.세부항목 = '';
      currentContext.원가통계비목 = '';
    } else if (level === 2) {
      currentContext.세부항목 = trimmedValue;
      currentContext.원가통계비목 = '';
    } else if (level === 3) {
      currentContext.원가통계비목 = trimmedValue;

      // 실제 데이터 행 - 행 추가
      const row: ParsedRow = {
        세부사업: currentContext.세부사업,
        세부항목: currentContext.세부항목,
        원가통계비목: currentContext.원가통계비목
      };

      // 나머지 컬럼 값 추가
      for (let colIdx = 1; colIdx <= range.e.c; colIdx++) {
        const dataAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
        const dataCell = sheet[dataAddress];
        const headerName = originalHeaders[colIdx] || `컬럼${colIdx}`;

        row[headerName] = dataCell && dataCell.v !== undefined ? dataCell.v : '';
      }

      rows.push(row);
    }
  }

  // 출력 헤더: 세부사업, 세부항목, 원가통계비목 + 나머지
  const outputHeaders = ['세부사업', '세부항목', '원가통계비목', ...originalHeaders.slice(1)];

  return {
    headers: outputHeaders,
    rows
  };
}
