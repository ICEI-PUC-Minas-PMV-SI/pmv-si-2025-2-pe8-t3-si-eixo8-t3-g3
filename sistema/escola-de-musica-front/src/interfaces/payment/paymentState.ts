import type PaymentDto from './paymentDto';

export default interface PaymentState {
  payments: PaymentDto[];
  payment: PaymentDto | null;
}