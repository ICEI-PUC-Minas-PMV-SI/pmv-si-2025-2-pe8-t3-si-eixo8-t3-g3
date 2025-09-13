import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/entities/instrument.entity';
import { Registration, RegistrationStatus } from 'src/entities/registration.entity';
import { Student } from 'src/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateRegistrationDto } from './dtos/create-registration.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const { studentId, instrumentIds, ...registrationData } = createRegistrationDto;

    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const instruments = await this.instrumentRepository.findByIds(instrumentIds);
    if (instruments.length !== instrumentIds.length) {
      throw new NotFoundException('One or more instruments not found.');
    }

    const newRegistration = this.registrationRepository.create({
      ...registrationData,
      student,
      instruments,
    });

    return this.registrationRepository.save(newRegistration);
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationRepository.find({ relations: ['student', 'student.user', 'instruments'] });
  }

  async findOne(id: number): Promise<Registration> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: ['student', 'instruments', 'payments', 'musicClasses'],
    });

    if (!registration) {
      throw new NotFoundException(`Registration with ID ${id} not found.`);
    }
    return registration;
  }

  async updateStatus(id: number, newStatus: RegistrationStatus): Promise<Registration> {
    const registration = await this.findOne(id);
    registration.status = newStatus;
    return this.registrationRepository.save(registration);
  }

  async remove(id: number): Promise<void> {
    const result = await this.registrationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registration with ID ${id} not found.`);
    }
  }
}