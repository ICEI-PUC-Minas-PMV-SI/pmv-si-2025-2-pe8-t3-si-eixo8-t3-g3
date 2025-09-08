import { IsNumber, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @IsNumber()
  userId: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  instrumentIds?: number[];
}