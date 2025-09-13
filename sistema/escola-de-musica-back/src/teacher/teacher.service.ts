import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/entities/instrument.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { User, UserRole } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { UpdateTeacherDto } from './dtos/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    let user: User;
    user = await this.userRepository.findOne({ where: { email: createTeacherDto.email } });

    if (user) {
      throw new NotFoundException(`Usuário com e-mail ${createTeacherDto.email} já existe.`);
    }

    const newUser = this.userRepository.create({ ...createTeacherDto, role: UserRole.PROFESSOR });
    const newUserSaved = await this.userRepository.save(newUser);

    const newTeacher = this.teacherRepository.create({
      user: newUserSaved,
      hireDate: createTeacherDto.hireDate ? new Date(createTeacherDto.hireDate) : undefined,
    });

    if (createTeacherDto.instrumentIds && createTeacherDto.instrumentIds.length > 0) {
      const instruments = await this.instrumentRepository.findBy({ id: In(createTeacherDto.instrumentIds) });
      if (instruments.length !== createTeacherDto.instrumentIds.length) {
        throw new NotFoundException('Um ou mais instrumentos não encontrados.');
      }
      newTeacher.instruments = instruments;
    }

    return this.teacherRepository.save(newTeacher);
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find({ relations: ['user', 'instruments'] });
  }

  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['user', 'instruments', 'musicClasses'],
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found.`);
    }
    return teacher;
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['instruments', 'user'],
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found.`);
    }

    if (updateTeacherDto.hireDate !== undefined) {
      teacher.hireDate = updateTeacherDto.hireDate ? new Date(updateTeacherDto.hireDate) : undefined;
    }

    if (teacher.user) {
      if (updateTeacherDto.name !== undefined) {
        teacher.user.name = updateTeacherDto.name;
      }
      if (updateTeacherDto.email !== undefined) {
        teacher.user.email = updateTeacherDto.email;
      }
      if (updateTeacherDto.password !== undefined) {
        teacher.user.password = updateTeacherDto.password;
      }
      await this.userRepository.save(teacher.user);
    }

    if (updateTeacherDto.instrumentIds) {
      const instruments = await this.instrumentRepository.findBy({ id: In(updateTeacherDto.instrumentIds) });
      teacher.instruments = instruments;
    }

    return this.teacherRepository.save(teacher);
  }

  async remove(id: number): Promise<void> {
    const result = await this.teacherRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Teacher with ID ${id} not found.`);
    }
  }
}