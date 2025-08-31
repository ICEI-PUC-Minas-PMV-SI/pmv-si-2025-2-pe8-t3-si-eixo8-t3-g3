import { IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from 'src/entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  paymentDate: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsNumber()
  studentId: number;

  @IsNumber()
  registrationId: number;
}