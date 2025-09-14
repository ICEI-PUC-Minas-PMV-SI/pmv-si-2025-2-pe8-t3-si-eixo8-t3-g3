import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  getDashboardMetrics() {
    return this.dashboardService.getMetrics();
  }

  @Get('students-by-month')
  getNewStudentsData() {
    return this.dashboardService.getNewStudentsData();
  }
  
  @Get('events')
  getRecentEvents() {
    return this.dashboardService.getRecentEvents();
  }
}