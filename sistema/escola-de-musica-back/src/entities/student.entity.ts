import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Registration } from './registration.entity';
import { Payment } from './payment.entity';
import { MusicClass } from './music-class.entity';
import { PerformanceReport } from './performance-report.entity';
import { Attendance } from './attendance.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ default: false })
  isEnrolled: boolean;

  @OneToMany(() => Registration, registration => registration.student)
  registrations: Registration[];

  @ManyToMany(() => MusicClass, musicClass => musicClass.students)
  musicClasses: MusicClass[];

  @OneToMany(() => Attendance, attendance => attendance.student)
  attendances: Attendance[];
  
  @OneToMany(() => Payment, payment => payment.student)
  payments: Payment[];

  @OneToMany(() => PerformanceReport, performanceReport => performanceReport.student)
  performanceReports: PerformanceReport[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
