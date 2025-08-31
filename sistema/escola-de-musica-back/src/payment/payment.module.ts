import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from 'src/entities/payment.entity';
import { Student } from 'src/entities/student.entity';
import { Registration } from 'src/entities/registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Student, Registration])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}