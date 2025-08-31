import { IsNumber, IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  studentId: number;

  @IsNumber()
  musicClassId: number;

  @IsBoolean()
  @IsOptional()
  isPresent?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}