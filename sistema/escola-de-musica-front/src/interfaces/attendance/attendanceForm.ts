import type { AttendanceStatus } from './attendanceStatus';

export default interface AttendanceForm {
  id?: number | null;
  date: string | null;
  status: AttendanceStatus;
  notes?: string | null;
  studentId: number | null;
  musicClassId: number | null;
}