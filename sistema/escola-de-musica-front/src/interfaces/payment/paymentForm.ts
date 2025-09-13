import type { PaymentStatus } from './paymentStatus';

export default interface PaymentForm {
  id?: number | null;
  amount: number | null;
  paymentDate: string | null;
  status: PaymentStatus;
  studentId: number | null;
  registrationId: number | null;
}