import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../../entities/attendance.entity';

export class CreateAttendanceDto {
  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsInt()
  studentId: number;

  @IsInt()
  musicClassId: number;
}
