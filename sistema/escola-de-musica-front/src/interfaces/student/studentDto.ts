import type UserDto from '@/interfaces/user/userDto';
import type RegistrationDto from '@/interfaces/registration/registrationDto';

export default interface StudentDto {
  id: number;
  cpf: string;
  cellphone: string;
  user: UserDto;
  isEnrolled: boolean;
  registration: RegistrationDto;
}