import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';
import { UpdateAttendanceDto } from './dtos/update-attendance.dto';
import { Student } from '../entities/student.entity';
import { MusicClass } from '../entities/music-class.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(MusicClass)
    private musicClassRepository: Repository<MusicClass>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { studentId, musicClassId, ...attendanceData } = createAttendanceDto;

    const student = await this.studentRepository.findOne({ where: { id: studentId }, relations: ['user'] });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const musicClass = await this.musicClassRepository.findOne({ where: { id: musicClassId } });
    if (!musicClass) {
      throw new NotFoundException(`MusicClass with ID ${musicClassId} not found.`);
    }

    const newAttendance = this.attendanceRepository.create({
      ...attendanceData,
      student,
      musicClass,
    });

    const attendanceSaved = await this.attendanceRepository.save(newAttendance);

    return attendanceSaved;
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({ relations: ['student', 'student.user', 'musicClass'] });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['student', 'student.user', 'musicClass'],
    });
    if (!attendance) {
      throw new NotFoundException(`Presença com ID ${id} não encontrado.`);
    }
    return attendance;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    this.attendanceRepository.merge(attendance, updateAttendanceDto);
    return this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance with ID ${id} not found.`);
    }
  }
}