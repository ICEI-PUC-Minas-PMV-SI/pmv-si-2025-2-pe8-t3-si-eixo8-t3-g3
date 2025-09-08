export default interface AttendanceForm {
  id?: number | null;
  date: string | null;
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED_ABSENCE';
  studentId: number | null;
  musicClassId: number | null;
}