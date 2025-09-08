import type StudentDto from '@/interfaces/student/studentDto';
import type MusicClassDto from '../music-class/musicClassDto';

export default interface PerformanceReportDto {
  id: number;
  grade: number;
  notes: string;
  reportDate: string;
  student: StudentDto;
  musicClass: MusicClassDto;
}