import type StudentDto from './studentDto';

export default interface StudentState {
  students: StudentDto[];
  student: StudentDto | null;
}