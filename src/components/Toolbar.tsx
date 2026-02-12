'use client';

import { ParsedRow } from '@/lib/parser';
import { convertToTSV, exportToXLSX } from '@/lib/export';

interface ToolbarProps {
  headers: string[];
  rows: ParsedRow[];
  selectedRows: Set<number>;
  filename: string;
}

export default function Toolbar({ headers, rows, selectedRows, filename }: ToolbarProps) {
  const selectedRowsArray = Array.from(selectedRows).sort((a, b) => a - b);
  const selectedData = selectedRowsArray.map(idx => rows[idx]);
  const hasSelection = selectedRows.size > 0;

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

  const handleCopySelected = async () => {
    if (!hasSelection) {
      alert('복사할 행을 선택해주세요.');
      return;
    }

    try {
      const tsv = convertToTSV(headers, selectedData);
      await navigator.clipboard.writeText(tsv);
      alert(`선택된 ${selectedRows.size}개 행이 클립보드에 복사되었습니다.`);
    } catch (error) {
      console.error('복사 오류:', error);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const handleDownloadAll = () => {
    try {
      const baseFilename = filename.replace(/\.(xls|xlsx)$/i, '');
      exportToXLSX(headers, rows, `${baseFilename}_정규화.xlsx`);
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  const handleDownloadSelected = () => {
    if (!hasSelection) {
      alert('다운로드할 행을 선택해주세요.');
      return;
    }

    try {
      const baseFilename = filename.replace(/\.(xls|xlsx)$/i, '');
      exportToXLSX(headers, selectedData, `${baseFilename}_선택항목.xlsx`);
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-3 mb-8">
      {/* 선택 정보 */}
      {hasSelection && (
        <div className="flex items-center gap-2.5 text-sm text-[#525252] font-light">
          <svg className="w-4 h-4 text-[#D2886F]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="tracking-tight">
            {selectedRows.size}개 행 선택됨
          </span>
        </div>
      )}

      {/* 버튼 그룹 */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* 전체 복사/다운로드 */}
        <button
          onClick={handleCopyAll}
          className="px-5 py-2.5 bg-white border border-[#e5e5e5] text-[#171717] text-sm font-normal rounded-lg hover:border-[#D2886F] hover:shadow-md transition-all flex items-center gap-2 tracking-tight"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          전체 복사
        </button>

        <button
          onClick={handleDownloadAll}
          className="px-5 py-2.5 bg-[#D2886F] text-white text-sm font-normal rounded-lg hover:bg-[#C17760] transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 tracking-tight"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          전체 다운로드
        </button>

        {/* 선택 복사/다운로드 */}
        {hasSelection && (
          <>
            <div className="w-px h-8 bg-[#e5e5e5]" />

            <button
              onClick={handleCopySelected}
              className="px-5 py-2.5 bg-white border-2 border-[#D2886F] text-[#D2886F] text-sm font-normal rounded-lg hover:bg-[#D2886F] hover:text-white transition-all flex items-center gap-2 tracking-tight"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              선택 항목 복사 ({selectedRows.size})
            </button>

            <button
              onClick={handleDownloadSelected}
              className="px-5 py-2.5 bg-white border-2 border-[#D2886F] text-[#D2886F] text-sm font-normal rounded-lg hover:bg-[#D2886F] hover:text-white transition-all flex items-center gap-2 tracking-tight"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              선택 항목 다운로드 ({selectedRows.size})
            </button>
          </>
        )}

        <div className="ml-auto text-sm text-[#525252] font-light tracking-tight">
          총 {rows.length}행
        </div>
      </div>
    </div>
  );
}
