'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUploader from '@/components/FileUploader';
import DataTable from '@/components/DataTable';
import Toolbar from '@/components/Toolbar';
import { parseWorkbook, ParseResult } from '@/lib/parser';

export default function Home() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleFileLoad = (workbook: XLSX.WorkBook, fileName: string) => {
    try {
      setError('');
      const result = parseWorkbook(workbook);
      setParseResult(result);
      setFilename(fileName);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('파싱 오류:', error);
      setError(error instanceof Error ? error.message : '파일 파싱 중 오류가 발생했습니다.');
      setParseResult(null);
    }
  };

  const handleReset = () => {
    setParseResult(null);
    setFilename('');
    setError('');
    setSelectedRows(new Set());
  };

  const handleRowSelect = (rowIndex: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected && parseResult) {
      setSelectedRows(new Set(Array.from({ length: parseResult.rows.length }, (_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 - 중앙 정렬 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center px-3 py-1 bg-white/50 backdrop-blur-[10px] border border-[#e5e5e5] rounded-full text-xs font-light text-[#525252] mb-3 tracking-tight">
            학교 예산 관리 도구
          </div>
          <h1 className="text-2xl font-light text-[#171717] leading-tight tracking-[-0.02em] mb-2 mx-auto">
            사업관리카드 파서
          </h1>
          <p className="text-sm font-light text-[#525252] leading-snug tracking-tight mx-auto max-w-2xl">
            들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환합니다
          </p>
        </div>

        {/* 파일 업로드 또는 결과 표시 - 중앙 정렬 */}
        {!parseResult ? (
          <div className="flex flex-col items-center">
            <FileUploader onFileLoad={handleFileLoad} />

            {/* 오류 메시지 */}
            {error && (
              <div className="mt-4 max-w-2xl w-full p-3 bg-white border border-red-300 rounded-lg shadow-sm">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-normal text-[#171717] mb-0.5 tracking-tight">
                      파싱 오류
                    </h3>
                    <p className="text-xs font-light text-[#525252] leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 사용 안내 */}
            <div className="mt-4 max-w-2xl w-full p-3 bg-white border border-[#e5e5e5] rounded-lg shadow-sm">
              <h3 className="text-sm font-normal text-[#171717] mb-2 tracking-tight">
                사용 방법
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-xs font-light text-[#525252] leading-relaxed">
                <li>사업관리카드(예산) .xls 또는 .xlsx 파일을 업로드하세요</li>
                <li>파일이 자동으로 파싱되어 정규화된 테이블로 표시됩니다</li>
                <li>체크박스로 원하는 행을 선택할 수 있습니다</li>
                <li>&quot;전체 복사/다운로드&quot; 또는 &quot;선택 항목 복사/다운로드&quot; 버튼을 사용하세요</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            {/* 파일 정보 및 리셋 버튼 */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white p-3 rounded-lg shadow-sm border border-[#e5e5e5]">
              <div>
                <h2 className="text-sm font-normal text-[#171717] tracking-tight">
                  {filename}
                </h2>
                <p className="text-xs font-light text-[#525252] mt-0.5">
                  파싱 완료 ✓
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-white border border-[#e5e5e5] text-[#525252] text-xs font-normal rounded-lg hover:border-[#D2886F] hover:text-[#171717] transition-all tracking-tight whitespace-nowrap"
              >
                다른 파일 업로드
              </button>
            </div>

            {/* 툴바 */}
            <Toolbar
              headers={parseResult.headers}
              rows={parseResult.rows}
              selectedRows={selectedRows}
              filename={filename}
            />

            {/* 데이터 테이블 */}
            <DataTable
              headers={parseResult.headers}
              rows={parseResult.rows}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
            />
          </>
        )}
      </div>
    </div>
  );
}
