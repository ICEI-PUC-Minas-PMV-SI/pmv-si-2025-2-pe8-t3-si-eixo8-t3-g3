import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Instrument } from './instrument.entity';

@Entity()
export class PerformanceReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numberOfSongsLearned: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Student, student => student.performanceReports)
  student: Student;

  @ManyToOne(() => Instrument, instrument => instrument.performanceReports)
  instrument: Instrument;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}