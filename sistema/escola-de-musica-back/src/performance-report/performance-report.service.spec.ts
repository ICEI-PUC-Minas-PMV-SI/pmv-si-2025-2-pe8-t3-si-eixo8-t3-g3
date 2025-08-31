import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceReportService } from './performance-report.service';

describe('PerformanceReportService', () => {
  let service: PerformanceReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformanceReportService],
    }).compile();

    service = module.get<PerformanceReportService>(PerformanceReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
