import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PerformanceReportService } from './performance-report.service';
import { CreatePerformanceReportDto } from './dtos/create-performance-report.dto';
import { UpdatePerformanceReportDto } from './dtos/update-performance-report.dto';

@Controller('performance-reports')
export class PerformanceReportController {
  constructor(private readonly performanceReportService: PerformanceReportService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPerformanceReportDto: CreatePerformanceReportDto) {
    return this.performanceReportService.create(createPerformanceReportDto);
  }

  @Get()
  findAll() {
    return this.performanceReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performanceReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerformanceReportDto: UpdatePerformanceReportDto) {
    return this.performanceReportService.update(+id, updatePerformanceReportDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.performanceReportService.remove(+id);
  }
}