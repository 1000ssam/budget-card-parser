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

  const handleFileLoad = (workbook: XLSX.WorkBook, fileName: string) => {
    try {
      setError('');
      const result = parseWorkbook(workbook);
      setParseResult(result);
      setFilename(fileName);
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
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-block px-5 py-2 bg-white border border-[#e5e5e5] rounded-full text-sm text-[#525252] mb-4 shadow-sm">
            학교 예산 관리 도구
          </div>
          <h1 className="text-5xl font-semibold text-[#171717] mb-4 tracking-tight">
            사업관리카드 파서
          </h1>
          <p className="text-xl text-[#525252] font-light max-w-2xl mx-auto leading-relaxed">
            들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환합니다
          </p>
        </div>

        {/* 파일 업로드 또는 결과 표시 */}
        {!parseResult ? (
          <>
            <FileUploader onFileLoad={handleFileLoad} />

            {/* 오류 메시지 */}
            {error && (
              <div className="mt-8 max-w-2xl mx-auto p-5 bg-white border border-red-300 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
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
                    <h3 className="font-medium text-[#171717] mb-1">
                      파싱 오류
                    </h3>
                    <p className="text-sm text-[#525252]">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 사용 안내 */}
            <div className="mt-8 max-w-2xl mx-auto p-6 bg-white border border-[#e5e5e5] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#171717] mb-4 text-lg">
                사용 방법
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-[#525252]">
                <li>사업관리카드(예산) .xls 또는 .xlsx 파일을 업로드하세요</li>
                <li>파일이 자동으로 파싱되어 정규화된 테이블로 표시됩니다</li>
                <li>&quot;전체 복사&quot; 버튼으로 데이터를 복사하거나, &quot;엑셀 다운로드&quot; 버튼으로 파일을 저장하세요</li>
                <li>테이블의 셀을 드래그하여 원하는 범위를 복사할 수도 있습니다</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            {/* 파일 정보 및 리셋 버튼 */}
            <div className="mb-6 flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-[#e5e5e5]">
              <div>
                <h2 className="text-lg font-semibold text-[#171717]">
                  {filename}
                </h2>
                <p className="text-sm text-[#525252]">
                  파싱 완료 ✓
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-white border border-[#e5e5e5] text-[#525252] rounded-lg hover:border-[#D2886F] hover:text-[#171717] transition-all font-medium"
              >
                다른 파일 업로드
              </button>
            </div>

            {/* 툴바 */}
            <Toolbar
              headers={parseResult.headers}
              rows={parseResult.rows}
              filename={filename}
            />

            {/* 데이터 테이블 */}
            <DataTable
              headers={parseResult.headers}
              rows={parseResult.rows}
            />
          </>
        )}
      </div>
    </div>
  );
}
