import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/entities/instrument.entity';
import { PerformanceReport } from 'src/entities/performance-report.entity';
import { Student } from 'src/entities/student.entity';
import { Repository } from 'typeorm';
import { CreatePerformanceReportDto } from './dtos/create-performance-report.dto';
import { UpdatePerformanceReportDto } from './dtos/update-performance-report.dto';

@Injectable()
export class PerformanceReportService {
  constructor(
    @InjectRepository(PerformanceReport)
    private performanceReportRepository: Repository<PerformanceReport>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
  ) {}

  async create(createPerformanceReportDto: CreatePerformanceReportDto): Promise<PerformanceReport> {
    const { studentId, instrumentId, ...reportData } = createPerformanceReportDto;

    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const instrument = await this.instrumentRepository.findOne({ where: { id: instrumentId } });
    if (!instrument) {
      throw new NotFoundException(`Instrument with ID ${instrumentId} not found.`);
    }

    const newReport = this.performanceReportRepository.create({
      ...reportData,
      student,
      instrument,
    });

    return this.performanceReportRepository.save(newReport);
  }

  async findAll(): Promise<PerformanceReport[]> {
    return this.performanceReportRepository.find({ relations: ['student', 'instrument'] });
  }

  async findOne(id: number): Promise<PerformanceReport> {
    const report = await this.performanceReportRepository.findOne({
      where: { id },
      relations: ['student', 'instrument'],
    });
    if (!report) {
      throw new NotFoundException(`Performance Report with ID ${id} not found.`);
    }
    return report;
  }

  async update(id: number, updatePerformanceReportDto: UpdatePerformanceReportDto): Promise<PerformanceReport> {
    const report = await this.findOne(id);
    this.performanceReportRepository.merge(report, updatePerformanceReportDto);
    return this.performanceReportRepository.save(report);
  }

  async remove(id: number): Promise<void> {
    const result = await this.performanceReportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Performance Report with ID ${id} not found.`);
    }
  }
}