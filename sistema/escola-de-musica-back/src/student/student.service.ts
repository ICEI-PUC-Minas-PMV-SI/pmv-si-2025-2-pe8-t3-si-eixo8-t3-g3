import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { User, UserRole } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dtos/create-student.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const user = await this.userRepository.findOne({ where: { email: createStudentDto.email } });

    if (user) {
      throw new NotFoundException(`Usuário com e-mail ${createStudentDto.email} já existe.`);
    }

    const newUser = this.userRepository.create({ ...createStudentDto, role: UserRole.ALUNO });
    const newUserSaved = await this.userRepository.save(newUser);

    const newStudent = this.studentRepository.create({
      user: newUserSaved,
      isEnrolled: false,
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
      throw new NotFoundException(`Estudante com ID ${id} não encontrado.`);
    }
    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const user = await this.userRepository.findOne({ where: { email: updateStudentDto.email } });

    if (user) {
      throw new NotFoundException(`Usuário com e-mail ${updateStudentDto.email} já existe.`);
    }

    const student = await this.findOne(id);

    if (updateStudentDto.password) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(updateStudentDto.password, salt, 32)) as Buffer;
      updateStudentDto.password = salt + '.' + hash.toString('hex');
    } else {
      delete updateStudentDto.password
    }

    Object.assign(user, updateStudentDto);
    this.userRepository.save(user);

    this.studentRepository.merge(student, { user, isEnrolled: true });
    return this.studentRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }
  }
}