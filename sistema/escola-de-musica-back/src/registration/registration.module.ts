import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { Registration } from 'src/entities/registration.entity';
import { Student } from 'src/entities/student.entity';
import { Instrument } from 'src/entities/instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Student, Instrument])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}