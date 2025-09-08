export default interface PaymentForm {
  id?: number | null;
  amount: number | null;
  paymentDate: string | null;
  status: 'PENDING' | 'PAID' | 'CANCELED';
  studentId: number | null;
}