/**
 * 소속별 분석 컴포넌트
 * - 소속별 전반적만족도 평균 비교 그래프
 * - 소속별 5대 지표 세부 비교 테이블
 */
import React from 'react';
import { Building2, Layers, BarChart2 } from 'lucide-react';
import { DepartmentStat } from '../types';

interface DepartmentAnalysisProps {
  departmentStats: DepartmentStat[];
  overallAvg: number;
}

export const DepartmentAnalysis: React.FC<DepartmentAnalysisProps> = ({
  departmentStats,
  overallAvg,
}) => {
  // 최고 만족도 부서
  const topDept = departmentStats[0];

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>소속별 분석 (소속별 전반적 만족도 평균 비교)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            참여 부서별 전반적 만족도 비교 및 세부 교육 항목별 평균 편차를 확인합니다.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          총 <strong className="text-slate-800 tabular-nums">{departmentStats.length}개</strong> 부서 참여
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 소속별 전반적만족도 평균 막대그래프 (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>소속별 전반적 만족도 비교 그래프</span>
            </h3>
            <span className="text-[11px] text-slate-500">전체 평균: {overallAvg.toFixed(2)}점</span>
          </div>

          <div className="space-y-4">
            {departmentStats.map((dept, idx) => {
              const widthPct = (dept.overallAvg / 5.0) * 100;
              const isAboveOverall = dept.overallAvg >= overallAvg;

              return (
                <div key={dept.name} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-[11px] font-mono text-slate-400 font-semibold">
                        0{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {dept.name}
                      </span>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        ({dept.count}명)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="font-bold text-slate-900 tabular-nums">
                        {dept.overallAvg.toFixed(2)}점
                      </span>
                    </div>
                  </div>

                  {/* 비교 바 */}
                  <div className="relative h-7 bg-white rounded-md overflow-hidden p-0.5 border border-slate-200 flex items-center">
                    {/* 전체 평균선 표시 */}
                    <div
                      className="absolute top-0 bottom-0 w-px border-r-2 border-dashed border-slate-400 z-10"
                      style={{ left: `${(overallAvg / 5.0) * 100}%` }}
                      title={`전체 평균선 (${overallAvg.toFixed(2)}점)`}
                    />

                    <div
                      className={`h-full rounded transition-all duration-500 ease-out flex items-center justify-end pr-2 text-white font-bold text-xs ${
                        idx === 0
                          ? 'bg-blue-600'
                          : isAboveOverall
                          ? 'bg-slate-700'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className="drop-shadow-xs">{dept.overallAvg.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-2xs inline-block"></span>
              <span>최우수 부서 ({topDept?.name})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-slate-400 inline-block border-t border-dashed"></span>
              <span>전체 평균선 ({overallAvg.toFixed(2)}점)</span>
            </span>
          </div>
        </div>

        {/* 소속별 5대 지표 세부 비교 테이블 (7 cols) */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>소속별 세부 항목 평균 통계표</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">단위: 점 (5.00점 만점)</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 font-semibold">소속 부서</th>
                  <th className="py-2.5 px-2.5 font-semibold text-center">응답수</th>
                  <th className="py-2.5 px-3 font-semibold text-right text-blue-900 bg-blue-50/50">
                    전반적 만족도
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-right">강의 내용</th>
                  <th className="py-2.5 px-3 font-semibold text-right">강사 전달력</th>
                  <th className="py-2.5 px-3 font-semibold text-right">실습 도움도</th>
                  <th className="py-2.5 px-3 font-semibold text-right">추천 의향</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentStats.map((dept, i) => (
                  <tr
                    key={dept.name}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center font-mono">
                        {i + 1}
                      </span>
                      <span>{dept.name}</span>
                    </td>
                    <td className="py-2.5 px-2.5 text-center text-slate-600 tabular-nums">
                      {dept.count}명
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/30 tabular-nums font-mono">
                      {dept.overallAvg.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums font-mono">
                      {dept.lectureAvg.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums font-mono">
                      {dept.instructorAvg.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums font-mono">
                      {dept.practiceAvg.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums font-mono">
                      {dept.recommendAvg.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-xs text-slate-600">
            <strong>부서별 분석 소견: </strong>
            <span className="text-slate-700">
              {topDept ? `'${topDept.name}'의 전반적 만족도가 ${topDept.overallAvg.toFixed(2)}점으로 가장 높게 나타났으며, ` : ''}
              부서별 업무 특성에 따라 실습 도움도 및 강의 내용 적용도에 차이가 존재하므로 직무별 맞춤 사례 중심 커리큘럼 제공이 효과적입니다.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
