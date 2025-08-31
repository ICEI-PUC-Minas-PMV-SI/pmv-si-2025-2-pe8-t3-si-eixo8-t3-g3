import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceReportService } from './performance-report.service';
import { PerformanceReportController } from './performance-report.controller';
import { PerformanceReport } from 'src/entities/performance-report.entity';
import { Student } from 'src/entities/student.entity';
import { Instrument } from 'src/entities/instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceReport, Student, Instrument])],
  controllers: [PerformanceReportController],
  providers: [PerformanceReportService],
  exports: [PerformanceReportService],
})
export class PerformanceReportModule {}