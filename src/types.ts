/**
 * 교육 만족도 데이터 타입 정의
 */

export interface RawSurveyRow {
  번호: number | string;
  소속: string;
  전반적만족도: number;
  강의내용: number;
  강사전달력: number;
  실습도움도: number;
  추천의향: number;
  좋았던점: string;
  개선점: string;
}

export interface MetricItem {
  key: keyof Pick<RawSurveyRow, '전반적만족도' | '강의내용' | '강사전달력' | '실습도움도' | '추천의향'>;
  label: string;
  average: number; // 소수점 둘째 자리
  min: number;
  max: number;
  positiveRate: number; // 4~5점 비율 (%)
  distribution: { [score: number]: number }; // 1~5점 빈도
}

export interface DepartmentStat {
  name: string;
  count: number;
  overallAvg: number;
  lectureAvg: number;
  instructorAvg: number;
  practiceAvg: number;
  recommendAvg: number;
}

export interface CategorizedFeedback {
  category: string;
  count: number;
  percentage: number;
  representativeQuote: string;
  items: string[];
}

export interface FeedbackAnalysisResult {
  positive: CategorizedFeedback[];
  negative: CategorizedFeedback[];
}

export interface ExecutiveSummaryData {
  overallEvaluation: string;
  keyPositiveFeedback: string;
  keyImprovementFeedback: string;
  futureImplications: string;
}

export interface AnalysisData {
  totalRespondents: number;
  metrics: MetricItem[];
  overallSatisfactionAvg: number;
  highestMetric: { label: string; average: number };
  lowestMetric: { label: string; average: number };
  scoreDistribution: { score: number; label: string; count: number; percentage: number }[];
  departmentStats: DepartmentStat[];
  feedbackAnalysis: FeedbackAnalysisResult;
  executiveSummary: ExecutiveSummaryData;
  rawRows: RawSurveyRow[];
  uploadedFileName: string;
}
