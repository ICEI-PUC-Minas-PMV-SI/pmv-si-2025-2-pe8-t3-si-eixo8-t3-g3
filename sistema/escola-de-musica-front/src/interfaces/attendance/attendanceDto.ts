import type StudentDto from '@/interfaces/student/studentDto';
import type MusicClassDto from '../music-class/musicClassDto';

export default interface AttendanceDto {
  id: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED_ABSENCE';
  student: StudentDto;
  musicClass: MusicClassDto;
}