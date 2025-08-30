import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
import { MusicClass } from './music-class.entity';
import { Registration } from './registration.entity';
import { PerformanceReport } from './performance-report.entity';

@Entity()
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, teacher => teacher.instruments)
  teachers: Teacher[];

  @ManyToMany(() => MusicClass, musicClass => musicClass.instruments)
  classes: MusicClass[];

  @ManyToMany(() => Registration, registration => registration.instruments)
  registrations: Registration[];

  @OneToMany(() => PerformanceReport, performanceReport => performanceReport.instrument)
  performanceReports: PerformanceReport[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
