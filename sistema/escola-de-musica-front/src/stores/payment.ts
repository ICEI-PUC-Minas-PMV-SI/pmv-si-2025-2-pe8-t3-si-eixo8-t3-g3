import { defineStore } from 'pinia';
import type PaymentDto from '@/interfaces/payment/paymentDto';
import type PaymentState from '@/interfaces/payment/paymentState';

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentState => ({
    payments: [],
    payment: null,
  }),

  actions: {
    setPayments(payments: PaymentDto[]) {
      this.payments = payments;
    },

    setPayment(payment: PaymentDto) {
      this.payment = payment;
    },

    addPayment(payment: PaymentDto) {
      this.payments.push(payment);
    },

    updatePayment(updatedPayment: PaymentDto) {
      const index = this.payments.findIndex(p => p.id === updatedPayment.id);
      if (index !== -1) {
        this.payments[index] = updatedPayment;
      }
    },

    deletePayment(paymentToDelete: PaymentDto) {
      this.payments = this.payments.filter(p => p.id !== paymentToDelete.id);
    },

    resetPayment() {
      this.payment = null;
    },
  },
});