import type AttendanceDto from './attendanceDto';

export default interface AttendanceState {
  attendances: AttendanceDto[];
  attendance: AttendanceDto | null;
}