import type StudentDto from '@/interfaces/student/studentDto';
import type MusicClassDto from '../music-class/musicClassDto';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';
import type { RegistrationStatus } from './registrationStatus';

export default interface RegistrationDto {
  id: number;
  startDate: string;
  endDate: string;
  status: RegistrationStatus;
  student: StudentDto;
  musicClasses: MusicClassDto[];
  instruments: InstrumentDto[];
}