import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePerformanceReportDto {
  @IsNumber()
  numberOfSongsLearned: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  studentId: number;

  @IsNumber()
  instrumentId: number;
}