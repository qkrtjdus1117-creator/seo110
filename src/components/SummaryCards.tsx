/**
 * 핵심 결과 카드 컴포넌트
 * 1. 전체 응답자 수
 * 2. 전반적 만족도 평균 (소수점 둘째 자리)
 * 3. 가장 높은 평가 항목
 * 4. 가장 낮은 평가 항목
 */
import React from 'react';
import { Users, Award, TrendingUp, TrendingDown, Star, CheckCheck } from 'lucide-react';
import { AnalysisData } from '../types';

interface SummaryCardsProps {
  data: AnalysisData;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const { totalRespondents, overallSatisfactionAvg, highestMetric, lowestMetric, metrics } = data;

  // 추천 의향 및 긍정 응답률 (4점 이상 비율)
  const overallItem = metrics.find((m) => m.key === '전반적만족도');
  const positiveRate = overallItem ? overallItem.positiveRate : 0;
  const recommendItem = metrics.find((m) => m.key === '추천의향');

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span>교육 만족도 핵심 결과 요약</span>
        </h2>
        <span className="text-xs text-slate-500 tabular-nums">
          기준 척도: 5.00점 만점 리커트 척도
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 카드 1: 전체 응답자 수 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight text-slate-600">전체 응답자 수</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {totalRespondents.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-slate-500">명</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>전수 유효 설문 데이터 반영</span>
            </p>
          </div>
        </div>

        {/* 카드 2: 전반적 만족도 평균 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight text-slate-600">전반적 만족도 평균</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {overallSatisfactionAvg.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-slate-500">/ 5.00</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="text-amber-700 font-semibold tabular-nums">
                긍정평가 {positiveRate}%
              </span>
              <span className="text-slate-400">·</span>
              <span>4~5점 응답</span>
            </p>
          </div>
        </div>

        {/* 카드 3: 가장 높은 평가 항목 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight text-slate-600">가장 높은 평가 항목</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-xl font-bold text-emerald-800 tracking-tight truncate">
                {highestMetric.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {highestMetric.average.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-500">점</span>
              <span className="ml-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                최고점
              </span>
            </div>
          </div>
        </div>

        {/* 카드 4: 가장 낮은 평가 항목 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight text-slate-600">가장 낮은 평가 항목</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-xl font-bold text-slate-800 tracking-tight truncate">
                {lowestMetric.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {lowestMetric.average.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-500">점</span>
              <span className="ml-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                보완검토
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
