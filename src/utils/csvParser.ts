/**
 * CSV 파일 파싱 및 유효성 검사 모듈
 */
import Papa from 'papaparse';
import { RawSurveyRow } from '../types';

export interface ParseResult {
  success: boolean;
  rows?: RawSurveyRow[];
  error?: string;
  totalRows?: number;
}

// 예상 컬럼 매핑 (공백 제거 후 매칭 지원)
const COLUMN_ALIASES: Record<keyof RawSurveyRow, string[]> = {
  번호: ['번호', 'no', 'id', '순번'],
  소속: ['소속', '부서', '팀', '소속부서', 'department'],
  전반적만족도: ['전반적만족도', '전반적 만족도', '전체만족도', '종합만족도'],
  강의내용: ['강의내용', '강의 내용', '교육내용', '내용만족도'],
  강사전달력: ['강사전달력', '강사 전달력', '강사만족도', '전달력'],
  실습도움도: ['실습도움도', '실습 도움도', '실습만족도', '실습'],
  추천의향: ['추천의향', '추천 의향', '추천도', '타인추천'],
  좋았던점: ['좋았던점', '좋았던 점', '긍정의견', '만족요인', '우수의견'],
  개선점: ['개선점', '개선 점', '건의사항', '개선의견', '보완점', '불만사항'],
};

function normalizeHeader(header: string): string {
  return header.replace(/[\s_\-]/g, '').trim().toLowerCase();
}

export function parseSurveyCSV(fileOrText: File | string): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, any>>(fileOrText as any, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          resolve({
            success: false,
            error: 'CSV 파일에 데이터가 없습니다. 내용이 포함된 파일을 업로드해 주세요.',
          });
          return;
        }

        const headers = results.meta.fields || [];
        if (headers.length === 0) {
          resolve({
            success: false,
            error: 'CSV 헤더(열 이름)를 인식할 수 없습니다. 올바른 CSV 파일인지 확인해 주세요.',
          });
          return;
        }

        // 헤더 매핑 생성
        const headerMap: Partial<Record<keyof RawSurveyRow, string>> = {};

        for (const [targetKey, aliases] of Object.entries(COLUMN_ALIASES) as [keyof RawSurveyRow, string[]][]) {
          const matched = headers.find((h) => {
            const normH = normalizeHeader(h);
            return aliases.some((alias) => normH === normalizeHeader(alias));
          });
          if (matched) {
            headerMap[targetKey] = matched;
          }
        }

        // 모든 9개 필수 항목 검사: '번호', '소속', '전반적만족도', '강의내용', '강사전달력', '실습도움도', '추천의향', '좋았던점', '개선점'
        const requiredKeys: (keyof RawSurveyRow)[] = [
          '번호',
          '소속',
          '전반적만족도',
          '강의내용',
          '강사전달력',
          '실습도움도',
          '추천의향',
          '좋았던점',
          '개선점',
        ];

        const missingKeys = requiredKeys.filter((k) => !headerMap[k]);
        if (missingKeys.length > 0) {
          resolve({
            success: false,
            error: `CSV 파일에 필수 열(컬럼)이 누락되었습니다: [${missingKeys.map((k) => `'${k}'`).join(', ')}].\n모든 9개 열('번호', '소속', '전반적만족도', '강의내용', '강사전달력', '실습도움도', '추천의향', '좋았던점', '개선점')이 포함되어야 합니다.`,
          });
          return;
        }

        const scoreFields: (keyof Pick<
          RawSurveyRow,
          '전반적만족도' | '강의내용' | '강사전달력' | '실습도움도' | '추천의향'
        >)[] = ['전반적만족도', '강의내용', '강사전달력', '실습도움도', '추천의향'];

        const parsedRows: RawSurveyRow[] = [];
        const validationErrors: string[] = [];

        results.data.forEach((row, index) => {
          const rowNum = index + 2; // 헤더가 1행이므로 데이터는 2행부터

          // 완전히 비어있는 행은 제외
          const isRowEmpty = Object.values(row).every(
            (v) => v === null || v === undefined || String(v).trim() === ''
          );
          if (isRowEmpty) return;

          // 만족도 5대 점수 항목 유효성 검사 (1점~5점 범위)
          const validatedScores: Partial<Record<keyof RawSurveyRow, number>> = {};

          for (const field of scoreFields) {
            const rawVal = row[headerMap[field]!];
            const trimmed = String(rawVal ?? '').trim();

            if (trimmed === '') {
              validationErrors.push(
                `${rowNum}행: '${field}' 점수가 비어있습니다. 1~5점 사이의 점수를 입력해 주세요.`
              );
              continue;
            }

            const num = Number(trimmed);
            if (isNaN(num)) {
              validationErrors.push(
                `${rowNum}행: '${field}'의 값('${trimmed}')이 숫자가 아닙니다. 1~5점 사이의 숫자여야 합니다.`
              );
              continue;
            }

            if (num < 1 || num > 5) {
              validationErrors.push(
                `${rowNum}행: '${field}' 점수(${num}점)가 허용 범위(1~5점)를 벗어났습니다.`
              );
              continue;
            }

            validatedScores[field] = num;
          }

          if (validationErrors.length > 0) {
            return; // 에러가 발생한 경우 행 추가 중단
          }

          const rawRow: RawSurveyRow = {
            번호: row[headerMap.번호!] ? String(row[headerMap.번호!]).trim() : index + 1,
            소속: String(row[headerMap.소속!] || '').trim() || '미분류',
            전반적만족도: validatedScores.전반적만족도!,
            강의내용: validatedScores.강의내용!,
            강사전달력: validatedScores.강사전달력!,
            실습도움도: validatedScores.실습도움도!,
            추천의향: validatedScores.추천의향!,
            좋았던점: String(row[headerMap.좋았던점!] || '').trim(),
            개선점: String(row[headerMap.개선점!] || '').trim(),
          };

          parsedRows.push(rawRow);
        });

        // 점수 유효성 검증 실패 시 에러 반환
        if (validationErrors.length > 0) {
          const maxDisplay = 4;
          const displayErrors = validationErrors.slice(0, maxDisplay);
          const remainCount = validationErrors.length - maxDisplay;
          const errorSummary =
            displayErrors.join('\n') +
            (remainCount > 0 ? `\n...외 ${remainCount}건의 점수 오류가 추가로 발견되었습니다.` : '');

          resolve({
            success: false,
            error: `만족도 점수 유효성 검사 실패 (만족도 점수는 1점부터 5점까지여야 합니다):\n${errorSummary}`,
          });
          return;
        }

        if (parsedRows.length === 0) {
          resolve({
            success: false,
            error: '유효한 응답 데이터가 0건입니다. CSV 내용 형식을 확인해 주세요.',
          });
          return;
        }

        resolve({
          success: true,
          rows: parsedRows,
          totalRows: parsedRows.length,
        });
      },
      error: (err) => {
        resolve({
          success: false,
          error: `CSV 파일 읽기 중 오류가 발생했습니다: ${err.message}`,
        });
      },
    });
  });
}
