import type StudentDto from '@/interfaces/student/studentDto';
import type MusicClassDto from '../music-class/musicClassDto';

export default interface RegistrationDto {
  id: number;
  status: 'ACTIVE' | 'INACTIVE';
  student: StudentDto;
  musicClass: MusicClassDto;
}