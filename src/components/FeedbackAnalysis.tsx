/**
 * 서술형 의견 분석 컴포넌트
 * - 좋았던점: 실습, 강의 내용, 업무 활용, 강사 설명, 기타
 * - 개선점: 실습 시간, 진행 속도, 초보자 설명, 자료 및 예제, 추가 기능 요청, 기타
 * - 유형별 의견 개수 표시 및 대표 의견 요약
 */
import React, { useState } from 'react';
import { MessageSquarePlus, MessageSquareWarning, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { FeedbackAnalysisResult, CategorizedFeedback } from '../types';

interface FeedbackAnalysisProps {
  feedbackAnalysis: FeedbackAnalysisResult;
}

export const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({ feedbackAnalysis }) => {
  const [activePositiveCategory, setActivePositiveCategory] = useState<string | null>(null);
  const [activeNegativeCategory, setActiveNegativeCategory] = useState<string | null>(null);

  const togglePositive = (cat: string) => {
    setActivePositiveCategory(activePositiveCategory === cat ? null : cat);
  };

  const toggleNegative = (cat: string) => {
    setActiveNegativeCategory(activeNegativeCategory === cat ? null : cat);
  };

  const renderFeedbackCard = (
    item: CategorizedFeedback,
    isExpanded: boolean,
    onToggle: () => void,
    theme: 'positive' | 'negative'
  ) => {
    const isPositive = theme === 'positive';
    const badgeColor = isPositive
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-amber-50 text-amber-800 border-amber-200';

    return (
      <div
        key={item.category}
        className={`border rounded-lg transition-all ${
          isExpanded
            ? isPositive
              ? 'border-blue-300 bg-blue-50/20'
              : 'border-amber-300 bg-amber-50/20'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${badgeColor}`}>
              {item.category}
            </span>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {item.count}건
            </span>
            <span className="text-[11px] text-slate-400 tabular-nums">
              ({item.percentage}%)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="hidden sm:inline text-[11px]">
              {isExpanded ? '원문 접기' : '원문 보기'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        {/* 대표 의견 요약 (상시 노출) */}
        <div className="px-3.5 pb-3">
          <div className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-100">
            <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 rotate-180" />
            <div className="flex-1">
              <span className="text-[11px] font-semibold text-slate-500 mr-1.5">[대표 의견]</span>
              <span className="italic font-medium">"{item.representativeQuote}"</span>
            </div>
          </div>
        </div>

        {/* 세부 의견 리스트 (확장 시 노출) */}
        {isExpanded && (
          <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 text-xs">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
              전체 응답 내용 ({item.items.length}건):
            </div>
            {item.items.length === 0 ? (
              <p className="text-slate-400 text-xs py-1">작성된 의견이 없습니다.</p>
            ) : (
              <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {item.items.map((text, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded bg-white border border-slate-200 text-slate-700 text-xs leading-relaxed"
                  >
                    <span className="font-mono text-[10px] text-slate-400 mr-1.5">#{idx + 1}</span>
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-blue-600" />
            <span>서술형 의견 분석 (좋았던 점 & 개선 요청사항)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            학습자의 주관식 응답을 표준 운영 분석 기준에 따라 분류하고 유형별 의견 건수와 대표 내용을 요약합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 좋았던점 분석 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <MessageSquarePlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  좋았던 점 유형별 분석
                </h3>
                <span className="text-[11px] text-slate-500">
                  실습, 강의 내용, 업무 활용, 강사 설명, 기타
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              총 {feedbackAnalysis.positive.reduce((a, b) => a + b.count, 0)}건 분석
            </span>
          </div>

          <div className="space-y-3">
            {feedbackAnalysis.positive.map((item) =>
              renderFeedbackCard(
                item,
                activePositiveCategory === item.category,
                () => togglePositive(item.category),
                'positive'
              )
            )}
          </div>
        </div>

        {/* 개선점 분석 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <MessageSquareWarning className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  개선점 유형별 분석
                </h3>
                <span className="text-[11px] text-slate-500">
                  실습 시간, 진행 속도, 초보자 설명, 자료/예제, 추가 기능, 기타
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              총 {feedbackAnalysis.negative.reduce((a, b) => a + b.count, 0)}건 분석
            </span>
          </div>

          <div className="space-y-3">
            {feedbackAnalysis.negative.map((item) =>
              renderFeedbackCard(
                item,
                activeNegativeCategory === item.category,
                () => toggleNegative(item.category),
                'negative'
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
