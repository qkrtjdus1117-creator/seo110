/**
 * 상단 헤더 컴포넌트
 */
import React from 'react';
import { FileSpreadsheet, Printer, RotateCcw, Download } from 'lucide-react';
import { downloadSampleCsvTemplate } from '../utils/sampleData';

interface HeaderProps {
  hasData: boolean;
  onReset: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasData, onReset, onPrint }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 시스템 명칭 및 브랜드 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                교육 만족도 분석기
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                공공기관 운영지원
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              설문 CSV 데이터 자동 분석 및 결과보고서 요약 솔루션
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadSampleCsvTemplate()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            title="교육 만족도 조사 CSV 양식 템플릿 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">표준 CSV 양식 다운로드</span>
            <span className="md:hidden">양식 받기</span>
          </button>

          {hasData && (
            <>
              <button
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors shadow-2xs"
                title="결과보고서 인쇄 및 PDF 저장"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>보고서 인쇄</span>
              </button>

              <button
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                title="새로운 CSV 파일 업로드를 위해 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>데이터 초기화</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
