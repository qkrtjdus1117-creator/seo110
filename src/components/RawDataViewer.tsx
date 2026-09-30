/**
 * 응답 데이터 원본 조회 컴포넌트
 */
import React, { useState } from 'react';
import { Table, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { RawSurveyRow } from '../types';

interface RawDataViewerProps {
  rows: RawSurveyRow[];
}

export const RawDataViewer: React.FC<RawDataViewerProps> = ({ rows }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // 고유 소속 목록
  const departments = Array.from(new Set(rows.map((r) => r.소속)));

  const filteredRows = rows.filter((r) => {
    const matchesDept = deptFilter === 'ALL' || r.소속 === deptFilter;
    const matchesSearch =
      searchTerm === '' ||
      r.소속.includes(searchTerm) ||
      (r.좋았던점 && r.좋았던점.includes(searchTerm)) ||
      (r.개선점 && r.개선점.includes(searchTerm));
    return matchesDept && matchesSearch;
  });

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs mb-8 print:hidden">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>응답 데이터 원본 테이블 ({rows.length}건)</span>
              <span className="text-xs font-normal text-slate-500">
                {isOpen ? '접기' : '펼쳐보기'}
              </span>
            </h2>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          {/* 필터 및 검색 바 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">전체 소속 ({rows.length}명)</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="키워드 검색 (소속, 서술형 의견)"
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 z-10">
                <tr>
                  <th className="py-2.5 px-3 font-semibold w-12 text-center">번호</th>
                  <th className="py-2.5 px-3 font-semibold">소속</th>
                  <th className="py-2.5 px-2 font-semibold text-center">전반적</th>
                  <th className="py-2.5 px-2 font-semibold text-center">강의내용</th>
                  <th className="py-2.5 px-2 font-semibold text-center">강사전달</th>
                  <th className="py-2.5 px-2 font-semibold text-center">실습도움</th>
                  <th className="py-2.5 px-2 font-semibold text-center">추천의향</th>
                  <th className="py-2.5 px-3 font-semibold min-w-48">좋았던점</th>
                  <th className="py-2.5 px-3 font-semibold min-w-48">개선점</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-500 tabular-nums font-mono">
                      {r.번호}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {r.소속}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-blue-700 tabular-nums">
                      {r.전반적만족도}
                    </td>
                    <td className="py-2 px-2 text-center text-slate-700 tabular-nums">
                      {r.강의내용}
                    </td>
                    <td className="py-2 px-2 text-center text-slate-700 tabular-nums">
                      {r.강사전달력}
                    </td>
                    <td className="py-2 px-2 text-center text-slate-700 tabular-nums">
                      {r.실습도움도}
                    </td>
                    <td className="py-2 px-2 text-center text-slate-700 tabular-nums">
                      {r.추천의향}
                    </td>
                    <td className="py-2 px-3 text-slate-700 leading-relaxed">
                      {r.좋았던점 || <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-700 leading-relaxed">
                      {r.개선점 || <span className="text-slate-300">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-right text-[11px] text-slate-400">
            총 {filteredRows.length}건 검색됨
          </div>
        </div>
      )}
    </section>
  );
};
