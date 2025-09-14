import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from 'src/entities/attendance.entity';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsInt()
  studentId: number;

  @IsInt()
  musicClassId: number;
}
