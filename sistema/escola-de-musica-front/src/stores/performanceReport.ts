import { defineStore } from 'pinia';
import type PerformanceReportDto from '@/interfaces/performance-report/performanceReportDto';
import type PerformanceReportState from '@/interfaces/performance-report/performanceReportState';

export const usePerformanceReportStore = defineStore('performanceReport', {
  state: (): PerformanceReportState => ({
    performanceReports: [],
    performanceReport: null,
  }),

  actions: {
    setPerformanceReports(performanceReports: PerformanceReportDto[]) {
      this.performanceReports = performanceReports;
    },

    setPerformanceReport(performanceReport: PerformanceReportDto) {
      this.performanceReport = performanceReport;
    },

    addPerformanceReport(performanceReport: PerformanceReportDto) {
      this.performanceReports.push(performanceReport);
    },

    updatePerformanceReport(updatedPerformanceReport: PerformanceReportDto) {
      const index = this.performanceReports.findIndex(pr => pr.id === updatedPerformanceReport.id);
      if (index !== -1) {
        this.performanceReports[index] = updatedPerformanceReport;
      }
    },

    deletePerformanceReport(performanceReportToDelete: PerformanceReportDto) {
      this.performanceReports = this.performanceReports.filter(pr => pr.id !== performanceReportToDelete.id);
    },

    resetPerformanceReport() {
      this.performanceReport = null;
    },
  },
});