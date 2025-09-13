import type InstrumentDto from '../instrument/instrumentDto';
import type StudentDto from '../student/studentDto';
import type TeacherDto from '../teacher/teacherDto';

export default interface MusicClassDto {
  id: number;
  name: string;
  description?: string;
  teacher: TeacherDto;
  students: StudentDto[];
  instruments: InstrumentDto[];
}