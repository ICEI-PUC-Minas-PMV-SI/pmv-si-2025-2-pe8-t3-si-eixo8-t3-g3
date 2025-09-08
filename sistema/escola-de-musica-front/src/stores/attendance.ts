import { defineStore } from 'pinia';
import type AttendanceDto from '@/interfaces/attendance/attendanceDto';
import type AttendanceState from '@/interfaces/attendance/attendanceState';

export const useAttendanceStore = defineStore('attendance', {
  state: (): AttendanceState => ({
    attendances: [],
    attendance: null,
  }),

  actions: {
    setAttendances(attendances: AttendanceDto[]) {
      this.attendances = attendances;
    },

    setAttendance(attendance: AttendanceDto) {
      this.attendance = attendance;
    },

    addAttendance(attendance: AttendanceDto) {
      this.attendances.push(attendance);
    },

    updateAttendance(updatedAttendance: AttendanceDto) {
      const index = this.attendances.findIndex(a => a.id === updatedAttendance.id);
      if (index !== -1) {
        this.attendances[index] = updatedAttendance;
      }
    },

    deleteAttendance(attendanceToDelete: AttendanceDto) {
      this.attendances = this.attendances.filter(a => a.id !== attendanceToDelete.id);
    },

    resetAttendance() {
      this.attendance = null;
    },
  },
});