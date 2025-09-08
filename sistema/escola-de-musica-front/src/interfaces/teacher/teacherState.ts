import type TeacherDto from './teacherDto';

export default interface TeacherState {
  teachers: TeacherDto[];
  teacher: TeacherDto | null;
}