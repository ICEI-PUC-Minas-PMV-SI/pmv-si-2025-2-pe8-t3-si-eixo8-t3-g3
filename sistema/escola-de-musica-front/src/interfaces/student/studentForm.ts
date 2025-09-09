import type RegistrationForm from '@/interfaces/registration/registrationForm';

export default interface StudentForm {
  id?: number | null;
  name: string | null;
  email: string | null;
  password?: string | null;
  cellphone: string | null;
  cpf: string | null;
}