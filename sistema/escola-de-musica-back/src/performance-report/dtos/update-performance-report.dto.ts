import { PartialType } from '@nestjs/mapped-types';
import { CreatePerformanceReportDto } from './create-performance-report.dto';

export class UpdatePerformanceReportDto extends PartialType(CreatePerformanceReportDto) {}