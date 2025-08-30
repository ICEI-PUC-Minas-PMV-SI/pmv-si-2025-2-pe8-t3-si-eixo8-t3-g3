// registration.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { MusicClass } from './music-class.entity';
import { Instrument } from './instrument.entity';
import { Payment } from './payment.entity';

export enum RegistrationStatus {
  VIGENTE = 'VIGENTE',
  INATIVA = 'INATIVA',
  PENDENTE = 'PENDENTE',
}

@Entity()
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDENTE,
  })
  status: RegistrationStatus;

  @ManyToOne(() => Student, student => student.registrations)
  student: Student;

  @ManyToMany(() => MusicClass, musicClass => musicClass.registrations)
  @JoinTable()
  musicClasses: MusicClass[];

  @ManyToMany(() => Instrument, instrument => instrument.registrations)
  @JoinTable()
  instruments: Instrument[];

  @OneToMany(() => Payment, payment => payment.registration)
  payments: Payment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
