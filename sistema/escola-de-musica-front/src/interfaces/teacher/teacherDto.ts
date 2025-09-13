import type UserDto from '@/interfaces/user/userDto';
import type InstrumentDto from '@/interfaces/instrument/instrumentDto';

export default interface TeacherDto {
  id: number;
  user: UserDto;
  hireDate: string;
  instruments?: InstrumentDto[];
}