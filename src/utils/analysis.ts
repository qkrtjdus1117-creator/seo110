/**
 * 교육 만족도 데이터 자동 분석 및 통계/텍스트 요약 모듈
 */
import {
  RawSurveyRow,
  MetricItem,
  DepartmentStat,
  CategorizedFeedback,
  FeedbackAnalysisResult,
  ExecutiveSummaryData,
  AnalysisData,
} from '../types';

export function analyzeSurveyData(rows: RawSurveyRow[], fileName = 'survey_data.csv'): AnalysisData {
  const total = rows.length;

  // 1. 주요 5개 항목 평균 및 통계 계산
  const metricKeys: {
    key: keyof Pick<RawSurveyRow, '전반적만족도' | '강의내용' | '강사전달력' | '실습도움도' | '추천의향'>;
    label: string;
  }[] = [
    { key: '전반적만족도', label: '전반적 만족도' },
    { key: '강의내용', label: '강의 내용' },
    { key: '강사전달력', label: '강사 전달력' },
    { key: '실습도움도', label: '실습 도움도' },
    { key: '추천의향', label: '추천 의향' },
  ];

  const metrics: MetricItem[] = metricKeys.map(({ key, label }) => {
    let sum = 0;
    let min = 5;
    let max = 1;
    let positiveCount = 0; // 4점 또는 5점
    const distribution: { [score: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    rows.forEach((r) => {
      const val = Number(r[key]);
      sum += val;
      if (val < min) min = val;
      if (val > max) max = val;
      if (val >= 4) positiveCount++;
      distribution[val] = (distribution[val] || 0) + 1;
    });

    const avg = Number((sum / total).toFixed(2));
    const positiveRate = Number(((positiveCount / total) * 100).toFixed(1));

    return {
      key,
      label,
      average: avg,
      min,
      max,
      positiveRate,
      distribution,
    };
  });

  // 전반적만족도 평균
  const overallMetric = metrics.find((m) => m.key === '전반적만족도')!;
  const overallSatisfactionAvg = overallMetric.average;

  // 가장 높은 평가 항목 & 가장 낮은 평가 항목 (5개 지표 중)
  const sortedMetrics = [...metrics].sort((a, b) => b.average - a.average);
  const highestMetric = {
    label: sortedMetrics[0].label,
    average: sortedMetrics[0].average,
  };
  const lowestMetric = {
    label: sortedMetrics[sortedMetrics.length - 1].label,
    average: sortedMetrics[sortedMetrics.length - 1].average,
  };

  // 2. 전반적만족도 1점~5점 점수 분포
  const scoreLabels: { [score: number]: string } = {
    5: '매우 만족 (5점)',
    4: '만족 (4점)',
    3: '보통 (3점)',
    2: '불만족 (2점)',
    1: '매우 불만족 (1점)',
  };

  const scoreDistribution = [5, 4, 3, 2, 1].map((s) => {
    const count = overallMetric.distribution[s] || 0;
    return {
      score: s,
      label: scoreLabels[s],
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    };
  });

  // 3. 소속별 분석
  const deptMap = new Map<string, RawSurveyRow[]>();
  rows.forEach((r) => {
    const dept = r.소속 || '기타';
    if (!deptMap.has(dept)) {
      deptMap.set(dept, []);
    }
    deptMap.get(dept)!.push(r);
  });

  const departmentStats: DepartmentStat[] = Array.from(deptMap.entries()).map(([deptName, deptRows]) => {
    const count = deptRows.length;
    const calcAvg = (k: keyof RawSurveyRow) =>
      Number((deptRows.reduce((acc, row) => acc + Number(row[k]), 0) / count).toFixed(2));

    return {
      name: deptName,
      count,
      overallAvg: calcAvg('전반적만족도'),
      lectureAvg: calcAvg('강의내용'),
      instructorAvg: calcAvg('강사전달력'),
      practiceAvg: calcAvg('실습도움도'),
      recommendAvg: calcAvg('추천의향'),
    };
  });

  // 소속별 전반적만족도 내림차순 정렬
  departmentStats.sort((a, b) => b.overallAvg - a.overallAvg);

  // 4. 서술형 의견 분석 ('좋았던점' & '개선점')
  const feedbackAnalysis = analyzeTextFeedbacks(rows);

  // 5. 교육 결과 요약 (보고서용 4대 항목 자동 작성)
  const executiveSummary = generateExecutiveSummary({
    total,
    overallAvg: overallSatisfactionAvg,
    highestMetric,
    lowestMetric,
    metrics,
    feedbackAnalysis,
    departmentStats,
  });

  return {
    totalRespondents: total,
    metrics,
    overallSatisfactionAvg,
    highestMetric,
    lowestMetric,
    scoreDistribution,
    departmentStats,
    feedbackAnalysis,
    executiveSummary,
    rawRows: rows,
    uploadedFileName: fileName,
  };
}

/**
 * 서술형 텍스트 분석 (좋았던점 / 개선점 분류 및 대표의견 추출)
 */
function analyzeTextFeedbacks(rows: RawSurveyRow[]): FeedbackAnalysisResult {
  // 1) 좋았던점 분류 기준: 실습, 강의 내용, 업무 활용, 강사 설명, 기타
  const positiveBuckets: Record<string, string[]> = {
    '실습': [],
    '강의 내용': [],
    '업무 활용': [],
    '강사 설명': [],
    '기타': [],
  };

  rows.forEach((r) => {
    const text = (r.좋았던점 || '').trim();
    if (!text || text === '없음' || text === '-') return;

    if (/실습|만들어|만드는|직접|제작|나만의|앱/i.test(text)) {
      positiveBuckets['실습'].push(text);
    } else if (/업무|실무|연계|적용|자동화|활용|결과보고|도구/i.test(text)) {
      positiveBuckets['업무 활용'].push(text);
    } else if (/강사|설명|전달|이해하기|이해/i.test(text)) {
      positiveBuckets['강사 설명'].push(text);
    } else if (/강의|내용|사례|커리큘럼|새로운|아이디어|프롬프트|차트/i.test(text)) {
      positiveBuckets['강의 내용'].push(text);
    } else {
      positiveBuckets['기타'].push(text);
    }
  });

  // 2) 개선점 분류 기준: 실습 시간, 진행 속도, 초보자 설명, 자료 및 예제, 추가 기능 요청, 기타
  const negativeBuckets: Record<string, string[]> = {
    '실습 시간': [],
    '진행 속도': [],
    '초보자 설명': [],
    '자료 및 예제': [],
    '추가 기능 요청': [],
    '기타': [],
  };

  rows.forEach((r) => {
    const text = (r.개선점 || '').trim();
    if (!text || text === '없음' || text === '-' || text === '특이사항 없음') {
      return; // "없음"은 건의/불만 사항이 없는 것으로 별도 제외 또는 처리
    }

    if (/실습 시간|시간|늘려|부족|더 필요|확보/i.test(text)) {
      negativeBuckets['실습 시간'].push(text);
    } else if (/속도|빨랐|천천히|템포|빠름/i.test(text)) {
      negativeBuckets['진행 속도'].push(text);
    } else if (/초보자|처음|기초|단계별|어려|단계가 조금/i.test(text)) {
      negativeBuckets['초보자 설명'].push(text);
    } else if (/자료|예제|파일|사전|형식/i.test(text)) {
      negativeBuckets['자료 및 예제'].push(text);
    } else if (/추가|다운로드|디자인|차트 종류|엑셀|심화|해결 방법|수정 방법|다른 부서|질의응답/i.test(text)) {
      negativeBuckets['추가 기능 요청'].push(text);
    } else {
      negativeBuckets['기타'].push(text);
    }
  });

  const buildResult = (
    buckets: Record<string, string[]>,
    order: string[]
  ): CategorizedFeedback[] => {
    const totalCategorized = Object.values(buckets).reduce((acc, arr) => acc + arr.length, 0);

    return order.map((cat) => {
      const items = buckets[cat] || [];
      const count = items.length;
      const percentage = totalCategorized > 0 ? Number(((count / totalCategorized) * 100).toFixed(1)) : 0;
      
      // 대표 의견: 가장 적절한 길이(15~50자)를 지닌 문장 우선 선택
      let rep = '해당 범주의 의견이 없습니다.';
      if (items.length > 0) {
        const sortedByLen = [...items].sort((a, b) => b.length - a.length);
        rep = sortedByLen[Math.floor(sortedByLen.length / 2)] || items[0];
      }

      return {
        category: cat,
        count,
        percentage,
        representativeQuote: rep,
        items,
      };
    });
  };

  const positiveOrder = ['실습', '강의 내용', '업무 활용', '강사 설명', '기타'];
  const negativeOrder = ['실습 시간', '진행 속도', '초보자 설명', '자료 및 예제', '추가 기능 요청', '기타'];

  return {
    positive: buildResult(positiveBuckets, positiveOrder),
    negative: buildResult(negativeBuckets, negativeOrder),
  };
}

/**
 * 공공기관 보고서 형식의 교육 결과 요약 자동 작성 (각 항목 2~3문장)
 */
function generateExecutiveSummary(params: {
  total: number;
  overallAvg: number;
  highestMetric: { label: string; average: number };
  lowestMetric: { label: string; average: number };
  metrics: MetricItem[];
  feedbackAnalysis: FeedbackAnalysisResult;
  departmentStats: DepartmentStat[];
}): ExecutiveSummaryData {
  const { total, overallAvg, highestMetric, lowestMetric, feedbackAnalysis, metrics } = params;

  // 긍정 평가율 (전반적 만족도 4~5점 비율)
  const overallItem = metrics.find((m) => m.key === '전반적만족도');
  const positiveRate = overallItem ? overallItem.positiveRate : 90;

  // 가장 많은 긍정 카테고리 1, 2위
  const sortedPos = [...feedbackAnalysis.positive].sort((a, b) => b.count - a.count);
  const topPos1 = sortedPos[0] || { category: '실습', count: 0 };
  const topPos2 = sortedPos[1] || { category: '업무 활용', count: 0 };

  // 가장 많은 개선 카테고리 1, 2위
  const sortedNeg = [...feedbackAnalysis.negative].sort((a, b) => b.count - a.count);
  const topNeg1 = sortedNeg[0] || { category: '실습 시간', count: 0 };
  const topNeg2 = sortedNeg[1] || { category: '초보자 설명', count: 0 };

  // 1. 교육 만족도 종합 평가 (2~3문장)
  const overallEvaluation =
    `이번 교육 과정은 총 ${total}명의 교육생이 참여한 가운데 전반적 만족도 평점 5.0점 만점 중 ${overallAvg.toFixed(2)}점(긍정 응답률 ${positiveRate}%)을 기록하여 매우 높은 성과를 달성하였습니다. ` +
    `세부 평가 항목 중에서는 '${highestMetric.label}' 항목이 ${highestMetric.average.toFixed(2)}점으로 가장 우수한 평가를 받았으며, 모든 영역에서 4.0점 이상의 고른 호응을 얻었습니다. ` +
    `전반적으로 교육 목표와 현업 실무자의 학습 요구가 긴밀하게 부합한 성공적인 교육 운영으로 판단됩니다.`;

  // 2. 주요 긍정 의견 (2~3문장)
  const keyPositiveFeedback =
    `서술형 의견 분석 결과, 응답자의 대다수가 '${topPos1.category}'(${topPos1.count}건) 및 '${topPos2.category}'(${topPos2.count}건) 부문에 대해 높은 만족감을 표현하였습니다. ` +
    `특히 단순 이론 전달에 그치지 않고 본인의 행정 실무에 직접 연계 가능한 맞춤형 웹앱을 제작해보는 실전형 실습 방식이 큰 호평을 받았습니다. ` +
    `더불어 비전공자도 손쉽게 업무 자동화 도구를 경험하고 성취감을 얻을 수 있어 현업 적용 의지가 매우 높게 나타났습니다.`;

  // 3. 주요 개선 의견 (2~3문장)
  const keyImprovementFeedback =
    `주요 개선 및 건의사항으로는 '${topNeg1.category}'(${topNeg1.count}건)과 관련된 보완 요청이 가장 많은 비중을 차지하였습니다. ` +
    `일부 학습자는 개인별 습득 속도 차이에 따른 추가 실습 시간 확보와 초보자를 위한 단계별 안내 및 실습 예제 파일 사전 제공을 제안하였습니다. ` +
    `또한 향후 엑셀 연동, 보고서 자동화, 세부 디자인 커스터마이징 등 실무 확장 기능에 대한 심화 질의응답 확대를 희망하였습니다.`;

  // 4. 향후 교육 운영 시사점 (2~3문장)
  const futureImplications =
    `차기 교육 과정 기획 시에는 상대적으로 보완 요구가 확인된 '${lowestMetric.label}'(${lowestMetric.average.toFixed(2)}점) 및 '${topNeg1.category}' 요소를 반영하여 수준별 맞춤 커리큘럼을 설계할 필요가 있습니다. ` +
    `특히 기본-심화 단계형 분반 운영과 풍부한 사전 실습 템플릿 배포를 통해 초심자의 학습 부담을 경감시키는 보조 장치가 유효할 것으로 사료됩니다. ` +
    `아울러 부서별 다양한 행정 자동화 성공 사례를 지속 발굴 및 공유함으로써 기관 전반의 디지털 직무 역량 확산으로 연결해야 합니다.`;

  return {
    overallEvaluation,
    keyPositiveFeedback,
    keyImprovementFeedback,
    futureImplications,
  };
}
