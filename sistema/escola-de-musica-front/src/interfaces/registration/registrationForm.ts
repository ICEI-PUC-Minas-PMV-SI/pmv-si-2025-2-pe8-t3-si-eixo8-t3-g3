export default interface RegistrationForm {
  id?: number | null;
  status: 'ACTIVE' | 'INACTIVE';
  studentId: number | null;
  musicClassId: number | null;
}