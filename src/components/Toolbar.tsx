'use client';

import { ParsedRow } from '@/lib/parser';
import { convertToTSV, exportToXLSX } from '@/lib/export';

interface ToolbarProps {
  headers: string[];
  rows: ParsedRow[];
  filename: string;
}

export default function Toolbar({ headers, rows, filename }: ToolbarProps) {
  const handleCopyAll = async () => {
    try {
      const tsv = convertToTSV(headers, rows);
      await navigator.clipboard.writeText(tsv);
      alert('전체 데이터가 클립보드에 복사되었습니다. 엑셀에 붙여넣을 수 있습니다.');
    } catch (error) {
      console.error('복사 오류:', error);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const handleDownload = () => {
    try {
      const baseFilename = filename.replace(/\.(xls|xlsx)$/i, '');
      exportToXLSX(headers, rows, `${baseFilename}_정규화.xlsx`);
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={handleCopyAll}
        className="px-5 py-2.5 bg-white border border-[#e5e5e5] text-[#171717] rounded-lg hover:border-[#D2886F] hover:shadow-md transition-all flex items-center gap-2 font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        전체 복사
      </button>

      <button
        onClick={handleDownload}
        className="px-5 py-2.5 bg-[#D2886F] text-white rounded-lg hover:bg-[#C17760] transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        엑셀 다운로드
      </button>

      <div className="ml-auto text-sm text-[#525252] font-medium">
        총 {rows.length}행
      </div>
    </div>
  );
}
