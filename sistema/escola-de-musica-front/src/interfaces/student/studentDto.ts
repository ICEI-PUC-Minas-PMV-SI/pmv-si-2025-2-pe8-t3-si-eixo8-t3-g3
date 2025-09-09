import type UserDto from '@/interfaces/user/userDto';
import type RegistrationDto from '@/interfaces/registration/registrationDto';

export default interface StudentDto {
  id: number;
  isEnrolled: boolean;
  user: UserDto;
  registration: RegistrationDto;
}