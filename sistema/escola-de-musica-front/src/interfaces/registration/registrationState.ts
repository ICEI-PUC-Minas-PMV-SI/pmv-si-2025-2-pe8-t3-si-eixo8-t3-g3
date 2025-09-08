import type RegistrationDto from './registrationDto';

export default interface RegistrationState {
  registrations: RegistrationDto[];
  registration: RegistrationDto | null;
}