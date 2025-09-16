import type StudentDto from '@/interfaces/student/studentDto';
import type MusicClassDto from '../music-class/musicClassDto';
import type { AttendanceStatus } from './attendanceStatus';

export default interface AttendanceDto {
  id: number;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  student: StudentDto;
  musicClass: MusicClassDto;
}