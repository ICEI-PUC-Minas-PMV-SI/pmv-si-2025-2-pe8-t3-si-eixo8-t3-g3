import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentService } from './instrument.service';
import { InstrumentController } from './instrument.controller';
import { Instrument } from 'src/entities/instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  controllers: [InstrumentController],
  providers: [InstrumentService],
  exports: [InstrumentService],
})
export class InstrumentModule {}