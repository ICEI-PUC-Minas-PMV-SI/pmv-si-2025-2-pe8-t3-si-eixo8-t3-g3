import type StudentDto from '@/interfaces/student/studentDto';
import type RegistrationDto from '@/interfaces/registration/registrationDto';
import type { PaymentStatus } from './paymentStatus';

export default interface PaymentDto {
  id: number;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  student: StudentDto;
  registration: RegistrationDto;
}