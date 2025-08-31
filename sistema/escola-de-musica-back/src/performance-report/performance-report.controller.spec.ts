import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceReportController } from './performance-report.controller';

describe('PerformanceReportController', () => {
  let controller: PerformanceReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceReportController],
    }).compile();

    controller = module.get<PerformanceReportController>(PerformanceReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
