import type StudentDto from '@/interfaces/student/studentDto';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';

export default interface PerformanceReportDto {
  id: number;
  numberOfSongsLearned: number;
  notes?: string;
  createdAt: string;
  student: StudentDto;
  instrument: InstrumentDto;
}