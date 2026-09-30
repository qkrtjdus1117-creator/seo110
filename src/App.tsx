/**
 * 교육 만족도 분석기 - 메인 애플리케이션
 * 공공기관 교육 운영 업무 지원을 위한 교육 만족도 CSV 자동 분석 및 결과보고서 생성 웹앱
 */
import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { SummaryCards } from './components/SummaryCards';
import { ChartsSection } from './components/ChartsSection';
import { DepartmentAnalysis } from './components/DepartmentAnalysis';
import { FeedbackAnalysis } from './components/FeedbackAnalysis';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { RawDataViewer } from './components/RawDataViewer';
import { analyzeSurveyData } from './utils/analysis';
import { RawSurveyRow, AnalysisData } from './types';
import { FileSpreadsheet, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleDataLoaded = (rows: RawSurveyRow[], fileName: string) => {
    const result = analyzeSurveyData(rows, fileName);
    setAnalysisData(result);
    // 부드럽게 분석 결과 영역으로 스크롤 이동
    setTimeout(() => {
      const resultsElement = document.getElementById('analysis-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReset = () => {
    setAnalysisData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. 상단 내비게이션 / 헤더 */}
      <Header
        hasData={!!analysisData}
        onReset={handleReset}
        onPrint={handlePrint}
      />

      {/* 인쇄용 공공기관 공식 보고서 커버 헤더 (화면에서는 숨김, 인쇄 시 출력) */}
      <div className="hidden print:block p-8 border-b-2 border-slate-900 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-slate-500 tracking-wider">공공기관 교육운영 결과보고</span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">교육 만족도 조사 결과 종합 분석 보고서</h1>
            <p className="text-xs text-slate-600 mt-1">
              분석 파일: {analysisData?.uploadedFileName} · 분석 일자: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="border border-slate-300 text-center text-xs p-2 rounded">
            <div className="text-[10px] text-slate-500">결재 확인</div>
            <div className="font-bold text-slate-800 mt-1">담당자 날인</div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 1. 제목 & 2. 안내 문구 */}
        <section className="mb-8 print:hidden">
          <div className="border-l-4 border-blue-600 pl-4 py-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                교육 만족도 분석기
              </h1>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                공공기관 표준
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-normal max-w-none break-keep">
              교육 담당자가 CSV 파일을 업로드하면 5대 만족도 지표 분석, 차트 시각화 및 결과보고서 요약을 한 화면에서 자동으로 제공합니다.
            </p>
          </div>
        </section>

        {/* 3. CSV 파일 업로드 영역 */}
        <UploadSection
          onDataLoaded={handleDataLoaded}
          currentFileName={analysisData?.uploadedFileName}
          totalRespondents={analysisData?.totalRespondents}
          hasData={!!analysisData}
        />

        {/* 분석 전 초기 안내 (데이터 없을 때) */}
        {!analysisData && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
            <div className="max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <FileSpreadsheet className="w-7 h-7 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                분석 결과가 여기에 표시됩니다
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                상단의 업로드 영역에 교육 만족도 설문 CSV 파일을 등록하거나, <strong className="text-blue-600 font-semibold">'샘플 데이터로 바로 체험'</strong> 버튼을 클릭하여 즉시 기능을 확인해 보세요.
              </p>

              <div className="grid grid-cols-2 gap-3 text-left p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>5대 만족도 지표 소수점 2자리 자동 계산</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>소속별 만족도 비교 및 점수 분포도</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>좋았던점/개선점 서술형 키워드 분류</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>보고서용 4대 종합 요약문 즉시 작성</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4~8. 분석 결과 영역 (파일 업로드 후 자동 표시) */}
        {analysisData && (
          <div id="analysis-results" className="space-y-2 animate-fadeIn">
            {/* 4. 핵심 결과 카드 */}
            <SummaryCards data={analysisData} />

            {/* 5. 만족도 분석 차트 (항목별 평균 만족도 막대그래프 + 전반적만족도 1~5점 응답 분포 그래프) */}
            <ChartsSection
              metrics={analysisData.metrics}
              scoreDistribution={analysisData.scoreDistribution}
              totalRespondents={analysisData.totalRespondents}
            />

            {/* 6. 소속별 분석 (소속별 전반적만족도 평균 비교 그래프 및 세부 통계) */}
            <DepartmentAnalysis
              departmentStats={analysisData.departmentStats}
              overallAvg={analysisData.overallSatisfactionAvg}
            />

            {/* 7. 서술형 의견 분석 (좋았던점 & 개선점 기준별 분류 및 대표의견 요약) */}
            <FeedbackAnalysis
              feedbackAnalysis={analysisData.feedbackAnalysis}
            />

            {/* 8. 교육 결과 요약 (결과보고서용 4대 항목 자동 작성) */}
            <ExecutiveSummary
              summary={analysisData.executiveSummary}
              data={analysisData}
            />

            {/* 부가 기능: 응답 데이터 원본 테이블 조회 */}
            <RawDataViewer rows={analysisData.rawRows} />
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">교육 만족도 분석기</span>
            <span className="text-slate-300">|</span>
            <span>공공기관 교육 운영 업무 지원 웹앱</span>
          </div>
          <div className="text-slate-400">
            업로드된 설문 데이터는 브라우저 내부에서 안전하게 분석되며 외부 서버로 전송되지 않습니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
