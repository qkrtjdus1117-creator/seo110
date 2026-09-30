/**
 * CSV 파일 업로드 및 샘플 로드 섹션
 */
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, PlayCircle, Download } from 'lucide-react';
import { parseSurveyCSV } from '../utils/csvParser';
import { SAMPLE_CSV_CONTENT, downloadSampleCsvTemplate } from '../utils/sampleData';
import { RawSurveyRow } from '../types';

interface UploadSectionProps {
  onDataLoaded: (rows: RawSurveyRow[], fileName: string) => void;
  currentFileName?: string;
  totalRespondents?: number;
  hasData: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onDataLoaded,
  currentFileName,
  totalRespondents,
  hasData,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessCSV = async (fileOrText: File | string, fileName: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await parseSurveyCSV(fileOrText);
      if (result.success && result.rows) {
        onDataLoaded(result.rows, fileName);
      } else {
        setErrorMessage(result.error || 'CSV 데이터를 분석하는 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setErrorMessage(`파일 처리 오류: ${err?.message || '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMessage('CSV 형식(.csv)의 파일만 업로드할 수 있습니다.');
      return;
    }

    handleProcessCSV(file, file.name);
    // Reset input so re-uploading the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('CSV 파일(.csv)만 업로드 가능합니다.');
      return;
    }

    handleProcessCSV(file, file.name);
  };

  const handleLoadSample = () => {
    handleProcessCSV(SAMPLE_CSV_CONTENT, '공공기관_AI웹앱_교육만족도_샘플.csv');
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs mb-8 transition-all print:hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <span>교육 만족도 CSV 파일 업로드</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            교육 설문 응답이 기록된 CSV 파일을 등록하면 즉시 분석 통계와 결과보고서 요약문이 생성됩니다.
          </p>
        </div>

        {/* 상단 퀵 버튼 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-blue-600" />
            <span>샘플 데이터로 바로 체험 (30건)</span>
          </button>
        </div>
      </div>

      {/* 에러 메시지 알림 */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-900">CSV 데이터 유효성 검사 오류</p>
            <p className="mt-1 text-rose-700 whitespace-pre-line leading-relaxed font-normal">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-rose-500 hover:text-rose-700 underline font-medium cursor-pointer shrink-0"
          >
            닫기
          </button>
        </div>
      )}

      {/* 업로드 상태 표시: 이미 업로드된 경우 vs 미업로드 */}
      {hasData && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs sm:text-sm text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              분석 완료: <strong className="font-semibold text-emerald-950">{currentFileName}</strong> (총 <span className="font-bold text-emerald-700 tabular-nums">{totalRespondents}</span>명 응답 데이터)
            </span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
          >
            다른 파일로 재업로드
          </button>
        </div>
      )}

      {/* 드래그 앤 드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/70 bg-slate-50/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mb-3 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-semibold text-slate-800 mb-1 break-keep text-pretty">
            {isLoading
              ? 'CSV 파일을 분석하는 중입니다...'
              : 'CSV 파일을 이곳에 끌어다 놓거나 클릭하여 선택하세요'}
          </h3>

          <p className="text-xs text-slate-500 max-w-md mb-4 break-keep text-pretty">
            UTF-8 또는 일반 텍스트 CSV 형식을 지원하며, 업로드 즉시 모든 항목의 평균 및 서술형 분석이 자동 실행됩니다.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors">
            <span>컴퓨터에서 CSV 파일 선택</span>
          </div>
        </div>
      </div>

      {/* CSV 필수 컬럼 안내 표식 */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap break-keep">
          <span className="font-semibold text-slate-700">필수 포함 항목 (9개):</span>
          <span className="text-slate-600">번호, 소속, 전반적만족도, 강의내용, 강사전달력, 실습도움도, 추천의향, 좋았던점, 개선점</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            downloadSampleCsvTemplate();
          }}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          양식 다운로드 (.csv)
        </button>
      </div>
    </section>
  );
};
