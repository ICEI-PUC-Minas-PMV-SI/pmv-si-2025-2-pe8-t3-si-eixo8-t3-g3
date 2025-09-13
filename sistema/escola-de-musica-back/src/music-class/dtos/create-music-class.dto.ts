import { IsDateString, IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMusicClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  teacherId: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  instrumentIds?: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  studentIds?: number[];
}