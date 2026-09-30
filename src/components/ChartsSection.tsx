/**
 * 만족도 분석 차트 컴포넌트
 * 1. 항목별 평균 만족도 막대그래프 (전반적만족도, 강의내용, 강사전달력, 실습도움도, 추천의향)
 * 2. 전반적만족도 1점~5점 응답 분포 그래프
 */
import React, { useState } from 'react';
import { BarChart3, PieChart, Info, Check } from 'lucide-react';
import { MetricItem } from '../types';

interface ChartsSectionProps {
  metrics: MetricItem[];
  scoreDistribution: { score: number; label: string; count: number; percentage: number }[];
  totalRespondents: number;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  metrics,
  scoreDistribution,
  totalRespondents,
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  // 최고 점수 항목 찾기
  const maxMetricScore = Math.max(...metrics.map((m) => m.average));

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>만족도 분석 차트</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5대 핵심 영역별 평균 점수(5.00점 만점) 및 전반적 만족도의 점수 구간별 응답 분포입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 차트 1: 항목별 평균 만족도 막대그래프 (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  1. 항목별 평균 만족도 비교
                </h3>
                <span className="text-xs text-slate-500">
                  리커트 5점 만점 기준 (목표 기준선 4.0점)
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-600 rounded-2xs inline-block"></span>
                  <span>평균 점수</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-rose-400 inline-block border-t border-dashed"></span>
                  <span>우수 기준(4.0)</span>
                </span>
              </div>
            </div>

            {/* 수평 막대그래프 리스트 */}
            <div className="space-y-4 pt-2">
              {metrics.map((m) => {
                const isHighest = m.average === maxMetricScore;
                const widthPercent = (m.average / 5.0) * 100;

                return (
                  <div
                    key={m.key}
                    onMouseEnter={() => setHoveredMetric(m.key)}
                    onMouseLeave={() => setHoveredMetric(null)}
                    className="group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                          {m.label}
                        </span>
                        {isHighest && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            최고
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">
                          긍정응답 {m.positiveRate}%
                        </span>
                        <span className="text-sm font-bold text-slate-900 tabular-nums font-mono w-14 text-right">
                          {m.average.toFixed(2)}점
                        </span>
                      </div>
                    </div>

                    {/* 막대 바 트랙 */}
                    <div className="relative h-7 bg-slate-100 rounded-md overflow-hidden p-0.5 flex items-center">
                      {/* 4.0점 가이드라인 (4.0 / 5.0 = 80%) */}
                      <div
                        className="absolute top-0 bottom-0 w-px border-r border-dashed border-rose-400 z-10"
                        style={{ left: '80%' }}
                        title="우수 기준선 (4.0점)"
                      />

                      {/* 채워지는 바 */}
                      <div
                        className={`h-full rounded transition-all duration-500 ease-out flex items-center justify-end pr-2 text-white font-bold text-xs tabular-nums ${
                          isHighest
                            ? 'bg-blue-600 group-hover:bg-blue-700'
                            : 'bg-slate-700 group-hover:bg-slate-800'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      >
                        <span className="drop-shadow-xs">{m.average.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X축 스케일 눈금 */}
            <div className="relative mt-4 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0.0점</span>
              <span>1.0점</span>
              <span>2.0점</span>
              <span>3.0점</span>
              <span className="text-rose-500 font-semibold">4.0점 (우수)</span>
              <span>5.0점 (만점)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              전체 5개 영역 중 <strong>{metrics.filter((m) => m.average >= 4.0).length}개</strong> 항목이 공공기관 우수 기준(4.00점)을 상회하고 있습니다.
            </span>
          </div>
        </div>

        {/* 차트 2: 전반적만족도 1점~5점 응답 분포 그래프 (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  2. 전반적 만족도 점수 분포
                </h3>
                <span className="text-xs text-slate-500">
                  1점(매우 불만족) ~ 5점(매우 만족) 비율
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                총 {totalRespondents}명
              </div>
            </div>

            {/* 점수별 분포 리스트 */}
            <div className="space-y-3 pt-1">
              {scoreDistribution.map((item) => {
                const getBarColor = (score: number) => {
                  switch (score) {
                    case 5:
                      return 'bg-blue-600';
                    case 4:
                      return 'bg-sky-500';
                    case 3:
                      return 'bg-slate-400';
                    case 2:
                      return 'bg-amber-500';
                    case 1:
                      return 'bg-rose-500';
                    default:
                      return 'bg-slate-400';
                  }
                };

                return (
                  <div
                    key={item.score}
                    onMouseEnter={() => setHoveredScore(item.score)}
                    onMouseLeave={() => setHoveredScore(null)}
                    className="group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="font-bold text-slate-900 tabular-nums">
                          {item.count}명
                        </span>
                        <span className="text-slate-400 tabular-nums">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* 백분율 바 */}
                    <div className="h-6 bg-slate-100 rounded-md overflow-hidden p-0.5 flex items-center">
                      <div
                        className={`h-full rounded transition-all duration-500 ease-out flex items-center justify-end pr-2 text-white font-bold text-xs ${getBarColor(
                          item.score
                        )}`}
                        style={{ width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%` }}
                      >
                        {item.count > 0 && (
                          <span className="drop-shadow-xs text-[10px]">
                            {item.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 긍정 응답률 요약 박스 */}
          <div className="mt-5 p-3.5 bg-blue-50/60 border border-blue-100 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-blue-900">
                긍정 응답 비율 (4점+5점)
              </span>
              <span className="text-sm font-extrabold text-blue-800 font-mono tabular-nums">
                {(
                  (scoreDistribution.find((s) => s.score === 5)?.percentage || 0) +
                  (scoreDistribution.find((s) => s.score === 4)?.percentage || 0)
                ).toFixed(1)}
                %
              </span>
            </div>
            <p className="text-[11px] text-blue-700">
              전체 응답자 중 만족(4점) 또는 매우 만족(5점)을 선택한 수강생의 비율입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
