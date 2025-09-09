import type StudentDto from '@/interfaces/student/studentDto';
import type MusicClassDto from '../music-class/musicClassDto';
import type { RegistrationStatus } from './registrationStatus';

export default interface RegistrationDto {
  id: number;
  status: RegistrationStatus;
  student: StudentDto;
  musicClass: MusicClassDto;
}