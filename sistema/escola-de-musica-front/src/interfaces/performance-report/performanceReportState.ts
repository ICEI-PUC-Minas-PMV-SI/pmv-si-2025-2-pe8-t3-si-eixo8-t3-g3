import type PerformanceReportDto from './performanceReportDto';

export default interface PerformanceReportState {
  performanceReports: PerformanceReportDto[];
  performanceReport: PerformanceReportDto | null;
}