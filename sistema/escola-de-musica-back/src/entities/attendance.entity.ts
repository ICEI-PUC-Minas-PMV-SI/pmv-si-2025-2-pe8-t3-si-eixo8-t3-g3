import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { MusicClass } from './music-class.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENTE',
  ABSENT = 'AUSENTE',
  JUSTIFIED_ABSENCE = 'FALTA_JUSTIFICADA',
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Student, student => student.attendances)
  student: Student;

  @ManyToOne(() => MusicClass, musicClass => musicClass.attendances)
  musicClass: MusicClass;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}