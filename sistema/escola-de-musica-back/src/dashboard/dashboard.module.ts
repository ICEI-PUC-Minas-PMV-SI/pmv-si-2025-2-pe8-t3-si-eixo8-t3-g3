import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Student } from 'src/entities/student.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { MusicClass } from 'src/entities/music-class.entity';
import { Payment } from 'src/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, MusicClass, Payment]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}