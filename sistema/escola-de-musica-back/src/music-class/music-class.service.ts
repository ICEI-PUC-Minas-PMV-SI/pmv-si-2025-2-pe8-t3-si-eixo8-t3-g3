import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/entities/instrument.entity';
import { MusicClass } from 'src/entities/music-class.entity';
import { Student } from 'src/entities/student.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Repository } from 'typeorm';
import { CreateMusicClassDto } from './dtos/create-music-class.dto';
import { UpdateMusicClassDto } from './dtos/update-music-class.dto';

@Injectable()
export class MusicClassService {
  constructor(
    @InjectRepository(MusicClass)
    private musicClassRepository: Repository<MusicClass>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createMusicClassDto: CreateMusicClassDto): Promise<MusicClass> {
    const { teacherId, instrumentIds, studentIds, ...musicClassData } = createMusicClassDto;

    const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found.`);
    }

    const newMusicClass = this.musicClassRepository.create({
      ...musicClassData,
      teacher,
    });

    if (instrumentIds && instrumentIds.length > 0) {
      const instruments = await this.instrumentRepository.findByIds(instrumentIds);
      if (instruments.length !== instrumentIds.length) {
        throw new NotFoundException('One or more instruments not found.');
      }
      newMusicClass.instruments = instruments;
    }

    if (studentIds && studentIds.length > 0) {
      const students = await this.studentRepository.findByIds(studentIds);
      if (students.length !== studentIds.length) {
        throw new NotFoundException('One or more students not found.');
      }
      newMusicClass.students = students;
    }

    return this.musicClassRepository.save(newMusicClass);
  }

  async findAll(): Promise<MusicClass[]> {
    return this.musicClassRepository.find({ relations: ['teacher', 'instruments', 'students'] });
  }

  async findOne(id: number): Promise<MusicClass> {
    const musicClass = await this.musicClassRepository.findOne({
      where: { id },
      relations: ['teacher', 'instruments', 'students', 'attendances', 'registrations'],
    });
    if (!musicClass) {
      throw new NotFoundException(`Music class with ID ${id} not found.`);
    }
    return musicClass;
  }

  async update(id: number, updateMusicClassDto: UpdateMusicClassDto): Promise<MusicClass> {
    const musicClass = await this.musicClassRepository.findOne({
        where: { id },
        relations: ['teacher', 'instruments', 'students'],
    });
    if (!musicClass) {
        throw new NotFoundException(`Music class with ID ${id} not found.`);
    }

    if (updateMusicClassDto.teacherId) {
        const teacher = await this.teacherRepository.findOne({ where: { id: updateMusicClassDto.teacherId } });
        if (!teacher) {
            throw new NotFoundException(`Teacher with ID ${updateMusicClassDto.teacherId} not found.`);
        }
        musicClass.teacher = teacher;
    }

    if (updateMusicClassDto.instrumentIds) {
        const instruments = await this.instrumentRepository.findByIds(updateMusicClassDto.instrumentIds);
        musicClass.instruments = instruments;
    }

    if (updateMusicClassDto.studentIds) {
        const students = await this.studentRepository.findByIds(updateMusicClassDto.studentIds);
        musicClass.students = students;
    }

    this.musicClassRepository.merge(musicClass, updateMusicClassDto);
    return this.musicClassRepository.save(musicClass);
  }

  async remove(id: number): Promise<void> {
    const result = await this.musicClassRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Music class with ID ${id} not found.`);
    }
  }
}