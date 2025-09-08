import { defineStore } from 'pinia';
import type RegistrationDto from '@/interfaces/registration/registrationDto';
import type RegistrationState from '@/interfaces/registration/registrationState';

export const useRegistrationStore = defineStore('registration', {
  state: (): RegistrationState => ({
    registrations: [],
    registration: null,
  }),

  actions: {
    setRegistrations(registrations: RegistrationDto[]) {
      this.registrations = registrations;
    },

    setRegistration(registration: RegistrationDto) {
      this.registration = registration;
    },

    addRegistration(registration: RegistrationDto) {
      this.registrations.push(registration);
    },

    updateRegistration(updatedRegistration: RegistrationDto) {
      const index = this.registrations.findIndex(r => r.id === updatedRegistration.id);
      if (index !== -1) {
        this.registrations[index] = updatedRegistration;
      }
    },

    deleteRegistration(registrationToDelete: RegistrationDto) {
      this.registrations = this.registrations.filter(r => r.id !== registrationToDelete.id);
    },

    resetRegistration() {
      this.registration = null;
    },
  },
});