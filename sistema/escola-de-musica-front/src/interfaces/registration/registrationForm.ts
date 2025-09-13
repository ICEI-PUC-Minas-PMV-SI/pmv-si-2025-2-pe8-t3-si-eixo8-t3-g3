import type { RegistrationStatus } from './registrationStatus';

export default interface RegistrationForm {
  id?: number | null;
  startDate: string | null;
  endDate: string | null;
  status: RegistrationStatus;
  studentId: number | null;
  musicClassIds: number[];
  instrumentIds: number[];
}