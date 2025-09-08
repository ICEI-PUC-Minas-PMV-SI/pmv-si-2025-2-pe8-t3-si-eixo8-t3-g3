import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { CreateInstrumentDto } from './dtos/create-instrument.dto';
import { UpdateInstrumentDto } from './dtos/update-instrument.dto';

@Controller('instruments')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInstrumentDto: CreateInstrumentDto) {
    return this.instrumentService.create(createInstrumentDto);
  }

  @Get()
  findAll() {
    return this.instrumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instrumentService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInstrumentDto: UpdateInstrumentDto) {
    return this.instrumentService.update(+id, updateInstrumentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.instrumentService.remove(+id);
  }
}