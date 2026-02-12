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
      setSelectedRows(new Set()); // 새 파일 로드 시 선택 초기화
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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-[1400px] mx-auto px-[60px]">
        {/* 헤더 */}
        <div className="mb-24 max-w-[900px]">
          <div className="inline-flex items-center px-6 py-3 bg-white/50 backdrop-blur-[10px] border border-[#e5e5e5] rounded-full text-lg font-light text-[#525252] mb-8 tracking-tight">
            학교 예산 관리 도구
          </div>
          <h1 className="text-[6rem] font-light text-[#171717] leading-[1.1] tracking-[-0.04em] mb-8">
            사업관리카드 파서
          </h1>
          <p className="text-[2rem] font-light text-[#525252] leading-[1.6] tracking-[-0.02em] max-w-[1200px]">
            들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환합니다
          </p>
        </div>

        {/* 파일 업로드 또는 결과 표시 */}
        {!parseResult ? (
          <>
            <FileUploader onFileLoad={handleFileLoad} />

            {/* 오류 메시지 */}
            {error && (
              <div className="mt-12 max-w-2xl p-7 bg-white border border-red-300 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <svg
                    className="w-7 h-7 text-red-600 flex-shrink-0 mt-1"
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
                    <h3 className="text-xl font-normal text-[#171717] mb-2 tracking-tight">
                      파싱 오류
                    </h3>
                    <p className="text-lg font-light text-[#525252] leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 사용 안내 */}
            <div className="mt-12 max-w-2xl p-8 bg-white border border-[#e5e5e5] rounded-xl shadow-sm">
              <h3 className="text-2xl font-normal text-[#171717] mb-6 tracking-tight">
                사용 방법
              </h3>
              <ol className="list-decimal list-inside space-y-4 text-lg font-light text-[#525252] leading-relaxed">
                <li>사업관리카드(예산) .xls 또는 .xlsx 파일을 업로드하세요</li>
                <li>파일이 자동으로 파싱되어 정규화된 테이블로 표시됩니다</li>
                <li>체크박스로 원하는 행을 선택할 수 있습니다</li>
                <li>&quot;전체 복사/다운로드&quot; 또는 &quot;선택 항목 복사/다운로드&quot; 버튼을 사용하세요</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            {/* 파일 정보 및 리셋 버튼 */}
            <div className="mb-8 flex items-center justify-between bg-white p-8 rounded-xl shadow-sm border border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-normal text-[#171717] tracking-tight">
                  {filename}
                </h2>
                <p className="text-lg font-light text-[#525252] mt-1">
                  파싱 완료 ✓
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white border border-[#e5e5e5] text-[#525252] text-base font-normal rounded-lg hover:border-[#D2886F] hover:text-[#171717] transition-all tracking-tight"
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
