import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/entities/attendence.entity';
import { MusicClass } from 'src/entities/music-class.entity';
import { Student } from 'src/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';
import { UpdateAttendanceDto } from './dtos/update-attendance.dto';

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

    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const musicClass = await this.musicClassRepository.findOne({ where: { id: musicClassId } });
    if (!musicClass) {
      throw new NotFoundException(`Music class with ID ${musicClassId} not found.`);
    }

    const newAttendance = this.attendanceRepository.create({
      ...attendanceData,
      student,
      musicClass,
    });

    return this.attendanceRepository.save(newAttendance);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({ relations: ['student', 'musicClass'] });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['student', 'musicClass'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found.`);
    }
    return attendance;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);

    // Mescla as propriedades do DTO com a entidade
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