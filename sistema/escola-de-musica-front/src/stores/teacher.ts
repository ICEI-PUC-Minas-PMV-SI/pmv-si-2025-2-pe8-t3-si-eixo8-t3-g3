import { defineStore } from 'pinia';
import type TeacherDto from '@/interfaces/teacher/teacherDto';
import type TeacherState from '@/interfaces/teacher/teacherState';

export const useTeacherStore = defineStore('teacher', {
  state: (): TeacherState => ({
    teachers: [],
    teacher: null,
  }),

  actions: {
    setTeachers(teachers: TeacherDto[]) {
      this.teachers = teachers;
    },

    setTeacher(teacher: TeacherDto) {
      this.teacher = teacher;
    },

    addTeacher(teacher: TeacherDto) {
      this.teachers.push(teacher);
    },

    updateTeacher(updatedTeacher: TeacherDto) {
      const index = this.teachers.findIndex(t => t.id === updatedTeacher.id);
      if (index !== -1) {
        this.teachers[index] = updatedTeacher;
      }
    },

    deleteTeacher(teacherToDelete: TeacherDto) {
      this.teachers = this.teachers.filter(t => t.id !== teacherToDelete.id);
    },

    resetTeacher() {
      this.teacher = null;
    },
  },
});