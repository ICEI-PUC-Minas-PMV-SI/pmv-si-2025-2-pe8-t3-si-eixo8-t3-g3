import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { RegistrationStatus } from 'src/entities/registration.entity';

export class CreateRegistrationDto {
  @IsNumber()
  studentId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(RegistrationStatus)
  @IsOptional()
  status: RegistrationStatus;

  @IsNumber({}, { each: true })
  instrumentIds: number[];
}