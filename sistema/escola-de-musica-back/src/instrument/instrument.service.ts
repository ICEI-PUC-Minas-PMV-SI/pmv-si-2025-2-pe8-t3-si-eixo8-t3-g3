import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/entities/instrument.entity';
import { Repository } from 'typeorm';
import { CreateInstrumentDto } from './dtos/create-instrument.dto';
import { UpdateInstrumentDto } from './dtos/update-instrument.dto';

@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto): Promise<Instrument> {
    const newInstrument = this.instrumentRepository.create(createInstrumentDto);
    return this.instrumentRepository.save(newInstrument);
  }

  async findAll(): Promise<Instrument[]> {
    return this.instrumentRepository.find();
  }

  async findOne(id: number): Promise<Instrument> {
    const instrument = await this.instrumentRepository.findOne({
      where: { id },
      relations: ['teachers', 'classes', 'registrations', 'performanceReports'],
    });

    if (!instrument) {
      throw new NotFoundException(`Instrument with ID ${id} not found.`);
    }
    return instrument;
  }

  async update(id: number, updateInstrumentDto: UpdateInstrumentDto): Promise<Instrument> {
    const instrument = await this.findOne(id);
    this.instrumentRepository.merge(instrument, updateInstrumentDto);
    return this.instrumentRepository.save(instrument);
  }

  async remove(id: number): Promise<void> {
    const result = await this.instrumentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Instrument with ID ${id} not found.`);
    }
  }
}