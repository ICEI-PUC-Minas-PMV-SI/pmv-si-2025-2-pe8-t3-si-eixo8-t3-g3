import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicClassService } from './music-class.service';
import { MusicClassController } from './music-class.controller';
import { MusicClass } from 'src/entities/music-class.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Instrument } from 'src/entities/instrument.entity';
import { Student } from 'src/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicClass, Teacher, Instrument, Student])],
  controllers: [MusicClassController],
  providers: [MusicClassService],
  exports: [MusicClassService],
})
export class MusicClassModule {}