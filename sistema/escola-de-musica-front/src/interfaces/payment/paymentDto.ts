import type StudentDto from '@/interfaces/student/studentDto';

export default interface PaymentDto {
  id: number;
  amount: number;
  paymentDate: string;
  status: 'PENDING' | 'PAID' | 'CANCELED';
  student: StudentDto;
}