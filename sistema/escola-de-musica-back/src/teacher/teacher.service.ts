import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/entities/instrument.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
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
    const { userId, instrumentIds } = createTeacherDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const newTeacher = this.teacherRepository.create({
      user: user,
    });

    if (instrumentIds && instrumentIds.length > 0) {
      const instruments = await this.instrumentRepository.findByIds(instrumentIds);
      if (instruments.length !== instrumentIds.length) {
        throw new NotFoundException('One or more instruments not found.');
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

    if (updateTeacherDto.instrumentIds) {
      const instruments = await this.instrumentRepository.findByIds(updateTeacherDto.instrumentIds);
      teacher.instruments = instruments;
    }

    if (updateTeacherDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateTeacherDto.userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${updateTeacherDto.userId} not found.`);
      }
      teacher.user = user;
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