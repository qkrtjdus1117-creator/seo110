/**
 * 교육 결과 요약 컴포넌트
 * 공공기관 교육 결과보고서용 4대 핵심 요약문 자동 작성 (각 2~3문장)
 * 1. 교육 만족도 종합 평가
 * 2. 주요 긍정 의견
 * 3. 주요 개선 의견
 * 4. 향후 교육 운영 시사점
 */
import React, { useState } from 'react';
import { FileText, Copy, Check, Printer, Sparkles, Download } from 'lucide-react';
import { ExecutiveSummaryData, AnalysisData } from '../types';

interface ExecutiveSummaryProps {
  summary: ExecutiveSummaryData;
  data: AnalysisData;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary, data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const sections = [
    {
      id: 'overall',
      title: '1. 교육 만족도 종합 평가',
      content: summary.overallEvaluation,
      badge: '종합 성과',
    },
    {
      id: 'positive',
      title: '2. 주요 긍정 의견',
      content: summary.keyPositiveFeedback,
      badge: '우수 요인',
    },
    {
      id: 'improvement',
      title: '3. 주요 개선 의견',
      content: summary.keyImprovementFeedback,
      badge: '보완 요구',
    },
    {
      id: 'implications',
      title: '4. 향후 교육 운영 시사점',
      content: summary.futureImplications,
      badge: '제언 사항',
    },
  ];

  const handleCopySingle = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateFullReportText = () => {
    return `[교육 만족도 분석 결과보고서 요약]
- 분석 대상: ${data.uploadedFileName}
- 응답 인원: 총 ${data.totalRespondents}명
- 전반적 만족도 평점: ${data.overallSatisfactionAvg.toFixed(2)}점 / 5.00점 (긍정평가율 ${data.metrics[0].positiveRate}%)
- 최고 만족 영역: ${data.highestMetric.label} (${data.highestMetric.average.toFixed(2)}점)
- 보완 검토 영역: ${data.lowestMetric.label} (${data.lowestMetric.average.toFixed(2)}점)

1. 교육 만족도 종합 평가
${summary.overallEvaluation}

2. 주요 긍정 의견
${summary.keyPositiveFeedback}

3. 주요 개선 의견
${summary.keyImprovementFeedback}

4. 향후 교육 운영 시사점
${summary.futureImplications}`;
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generateFullReportText());
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 텍스트 파일 (.txt) 내보내기 기능
  const handleExportTextFile = () => {
    setIsExporting(true);
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanFileName = (data.uploadedFileName || '설문데이터').replace(/\.[^/.]+$/, '');
    const fileName = `교육결과요약_보고서_${cleanFileName}_${dateStr}.txt`;

    const textContent = `===================================================================
                  교육 만족도 분석 결과보고서 요약
===================================================================

[기본 정보]
- 분석 파일명: ${data.uploadedFileName}
- 전체 응답자 수: 총 ${data.totalRespondents}명
- 보고서 작성 일시: ${new Date().toLocaleString('ko-KR')}

[핵심 결과 지표]
- 전반적 만족도 평점: ${data.overallSatisfactionAvg.toFixed(2)}점 / 5.00점 (긍정 응답률: ${data.metrics[0].positiveRate}%)
- 최고 만족 영역: ${data.highestMetric.label} (${data.highestMetric.average.toFixed(2)}점)
- 보완 검토 영역: ${data.lowestMetric.label} (${data.lowestMetric.average.toFixed(2)}점)

-------------------------------------------------------------------
1. 교육 만족도 종합 평가
-------------------------------------------------------------------
${summary.overallEvaluation}

-------------------------------------------------------------------
2. 주요 긍정 의견
-------------------------------------------------------------------
${summary.keyPositiveFeedback}

-------------------------------------------------------------------
3. 주요 개선 의견
-------------------------------------------------------------------
${summary.keyImprovementFeedback}

-------------------------------------------------------------------
4. 향후 교육 운영 시사점
-------------------------------------------------------------------
${summary.futureImplications}

===================================================================
* 본 보고서는 공공기관 교육 만족도 분석기에서 자동 생성되었습니다.
===================================================================
`;

    // 윈도우 메모장 한글 깨짐 방지를 위한 UTF-8 BOM 추가
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 800);
  };

  // PDF 보고서 인쇄/저장 기능
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs mb-8 print:border-none print:shadow-none print:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              교육 결과 요약 (결과보고서용 자동 생성문)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            공공기관 결과보고서 및 결재 문서에 즉시 활용할 수 있도록 4대 영역별 2~3문장 요약문을 제공합니다.
          </p>
        </div>

        {/* 내보내기 및 복사 액션 버튼 그룹 */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* 텍스트 파일 내보내기 버튼 */}
          <button
            type="button"
            onClick={handleExportTextFile}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
            title="결과 요약 보고서를 텍스트(.txt) 파일로 다운로드합니다"
          >
            {isExporting ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">저장 완료!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>텍스트(.txt) 파일 저장</span>
              </>
            )}
          </button>

          {/* PDF 내보내기 / 인쇄 버튼 */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
            title="결과 요약 보고서를 PDF로 저장하거나 인쇄합니다"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>PDF 저장 / 인쇄</span>
          </button>

          {/* 클립보드 전체 복사 버튼 */}
          <button
            type="button"
            onClick={handleCopyAll}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs ${
              copiedKey === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copiedKey === 'all' ? (
              <>
                <Check className="w-4 h-4" />
                <span>보고서 복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>보고서 전체 복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4대 항목 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-900">
                  {sec.title}
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {sec.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal break-keep text-pretty">
                {sec.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex justify-end print:hidden">
              <button
                type="button"
                onClick={() => handleCopySingle(sec.id, sec.content)}
                className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === sec.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>문단 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 실무 활용 팁 */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-blue-900 print:hidden">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>교육 담당자 실무 가이드: </strong>
          위 4가지 요약 문안은 한글(HWP), MS Word, 온-나라 보고서 등의 서식에 맞게 바로 붙여넣어 활용하실 수 있습니다. 상단의 <strong>[텍스트(.txt) 파일 저장]</strong> 또는 <strong>[PDF 저장 / 인쇄]</strong> 버튼을 통해 문서를 즉시 파일로 내보낼 수 있습니다.
        </div>
      </div>
    </section>
  );
};

