import * as XLSX from 'xlsx';
import { ParsedRow } from './parser';

/**
 * 정규화된 데이터를 xlsx 파일로 내보내기
 */
export function exportToXLSX(headers: string[], rows: ParsedRow[], filename: string = '정규화_사업관리카드.xlsx') {
  // 헤더와 데이터를 결합하여 배열의 배열로 변환
  const data: any[][] = [];

  // 헤더 추가
  data.push(headers);

  // 데이터 행 추가
  rows.forEach(row => {
    const rowData: any[] = [];
    headers.forEach(header => {
      rowData.push(row[header] ?? '');
    });
    data.push(rowData);
  });

  // 워크시트 생성
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // 컬럼 너비 자동 조정
  const colWidths = headers.map((header, colIdx) => {
    let maxWidth = header.length;

    rows.forEach(row => {
      const cellValue = String(row[header] ?? '');
      maxWidth = Math.max(maxWidth, cellValue.length);
    });

    // 최소 10, 최대 50
    return { wch: Math.min(Math.max(maxWidth, 10), 50) };
  });

  worksheet['!cols'] = colWidths;

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '정규화데이터');

  // 파일 다운로드
  XLSX.writeFile(workbook, filename);
}

/**
 * 데이터를 TSV 형식으로 변환 (클립보드 복사용)
 */
export function convertToTSV(headers: string[], rows: ParsedRow[], includeHeaders: boolean = true): string {
  const lines: string[] = [];

  // 헤더
  if (includeHeaders) {
    lines.push(headers.join('\t'));
  }

  // 데이터
  rows.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return value !== undefined && value !== null ? String(value) : '';
    });
    lines.push(values.join('\t'));
  });

  return lines.join('\n');
}

/**
 * 데이터를 HTML 테이블로 변환 (노션 등 리치 텍스트 붙여넣기 호환)
 */
export function convertToHTML(headers: string[], rows: ParsedRow[], includeHeaders: boolean = true): string {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let html = '<table>';

  if (includeHeaders) {
    html += '<tr>' + headers.map(h => `<th>${escapeHtml(h)}</th>`).join('') + '</tr>';
  }

  rows.forEach(row => {
    html += '<tr>' + headers.map(header => {
      const value = row[header];
      const str = value !== undefined && value !== null ? String(value) : '';
      return `<td>${escapeHtml(str)}</td>`;
    }).join('') + '</tr>';
  });

  html += '</table>';
  return html;
}

/**
 * TSV + HTML 테이블을 모두 클립보드에 복사 (엑셀 + 노션 호환)
 */
export async function copyToClipboard(headers: string[], rows: ParsedRow[], includeHeaders: boolean = true): Promise<void> {
  const tsv = convertToTSV(headers, rows, includeHeaders);
  const html = convertToHTML(headers, rows, includeHeaders);

  const clipboardItem = new ClipboardItem({
    'text/plain': new Blob([tsv], { type: 'text/plain' }),
    'text/html': new Blob([html], { type: 'text/html' }),
  });

  await navigator.clipboard.write([clipboardItem]);
}
