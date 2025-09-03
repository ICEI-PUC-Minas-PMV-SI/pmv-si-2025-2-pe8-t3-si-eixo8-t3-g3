import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dtos/create-student.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const user = await this.userRepository.findOne({ where: { id: createStudentDto.userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${createStudentDto.userId} not found.`);
    }

    const newStudent = this.studentRepository.create({
      user: user,
      isEnrolled: createStudentDto.isEnrolled,
    });

    return this.studentRepository.save(newStudent);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user', 'registrations', 'payments', 'performanceReports'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }
    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    this.studentRepository.merge(student, updateStudentDto);
    return this.studentRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }
  }
}