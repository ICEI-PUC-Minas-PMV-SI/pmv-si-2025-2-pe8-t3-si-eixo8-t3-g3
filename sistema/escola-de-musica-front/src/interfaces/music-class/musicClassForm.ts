export default interface MusicClassForm {
  id?: number | null;
  name: string | null;
  teacherId: number | null;
  studentIds: number[];
  instrumentIds: number[];
}