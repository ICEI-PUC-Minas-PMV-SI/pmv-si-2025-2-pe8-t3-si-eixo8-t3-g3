import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';
import { Instrument } from './instrument.entity';
import { Attendance } from './attendence.entity';
import { Registration } from './registration.entity';

@Entity()
export class MusicClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  topic: string;

  @ManyToOne(() => Teacher, teacher => teacher.musicClasses)
  teacher: Teacher;

  @ManyToMany(() => Instrument)
  @JoinTable()
  instruments: Instrument[];

  @ManyToMany(() => Student, student => student.musicClasses)
  @JoinTable()
  students: Student[];

  @OneToMany(() => Attendance, attendance => attendance.musicClass)
  attendances: Attendance[];

  @ManyToMany(() => Registration, registration => registration.musicClasses)
  registrations: Registration[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}