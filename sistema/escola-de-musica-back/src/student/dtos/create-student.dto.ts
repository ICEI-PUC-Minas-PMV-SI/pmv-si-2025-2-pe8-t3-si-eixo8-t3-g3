import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  userId: number;

  @IsBoolean()
  @IsOptional()
  isEnrolled?: boolean;
}