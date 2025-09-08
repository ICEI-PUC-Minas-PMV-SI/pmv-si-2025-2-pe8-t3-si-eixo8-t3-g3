import type UserDto from '@/interfaces/user/userDto';

export default interface TeacherDto {
  id: number;
  cpf: string;
  cellphone: string;
  user: UserDto;
  hireDate: string;
}