import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from 'src/entities/attendence.entity';
import { Student } from 'src/entities/student.entity';
import { MusicClass } from 'src/entities/music-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Student, MusicClass])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}