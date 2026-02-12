'use client';

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

interface FileUploaderProps {
  onFileLoad: (workbook: XLSX.WorkBook, filename: string) => void;
}

export default function FileUploader({ onFileLoad }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          alert('파일을 읽을 수 없습니다.');
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        onFileLoad(workbook, file.name);
      } catch (error) {
        console.error('파일 파싱 오류:', error);
        alert('파일을 파싱하는 중 오류가 발생했습니다.');
      }
    };

    reader.onerror = () => {
      alert('파일 읽기 오류가 발생했습니다.');
    };

    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200 bg-white
          ${isDragging
            ? 'border-[#D2886F] bg-[#D2886F]/5 shadow-lg'
            : 'border-[#e5e5e5] hover:border-[#D2886F]/50 hover:shadow-md'
          }
        `}
      >
        <div className="flex flex-col items-center gap-5">
          <svg
            className="w-16 h-16 text-[#a3a3a3]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div>
            <p className="text-xl font-light text-[#171717] tracking-tight">
              사업관리카드(예산) 파일을 선택하거나 드래그하세요
            </p>
            <p className="text-base font-light text-[#525252] mt-2">
              .xls, .xlsx 파일 지원
            </p>
          </div>

          <button
            type="button"
            className="px-8 py-3 text-base bg-[#D2886F] text-white rounded-full hover:bg-[#C17760] transition-all hover:shadow-lg hover:-translate-y-0.5 font-normal tracking-tight"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            파일 선택
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xls,.xlsx"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
