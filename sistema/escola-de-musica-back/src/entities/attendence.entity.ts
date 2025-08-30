import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { MusicClass } from './music-class.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isPresent: boolean;

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
