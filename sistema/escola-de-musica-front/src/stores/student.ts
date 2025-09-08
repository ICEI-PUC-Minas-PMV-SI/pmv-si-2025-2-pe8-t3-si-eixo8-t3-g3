import { defineStore } from 'pinia';
import type StudentDto from '@/interfaces/student/studentDto';
import type StudentState from '@/interfaces/student/studentState';

export const useStudentStore = defineStore('student', {
  state: (): StudentState => ({
    students: [],
    student: null,
  }),

  actions: {
    setStudents(students: StudentDto[]) {
      this.students = students;
    },

    setStudent(student: StudentDto) {
      this.student = student;
    },

    addStudent(student: StudentDto) {
      this.students.push(student);
    },

    updateStudent(updatedStudent: StudentDto) {
      const index = this.students.findIndex(s => s.id === updatedStudent.id);
      if (index !== -1) {
        this.students[index] = updatedStudent;
      }
    },

    deleteStudent(studentToDelete: StudentDto) {
      this.students = this.students.filter(s => s.id !== studentToDelete.id);
    },

    resetStudent() {
      this.student = null;
    },
  },
});