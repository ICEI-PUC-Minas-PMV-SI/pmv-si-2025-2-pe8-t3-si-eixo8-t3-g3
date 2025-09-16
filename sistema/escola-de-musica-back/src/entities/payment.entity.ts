import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Registration } from './registration.entity';

export enum PaymentStatus {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  CANCELADO = 'CANCELADO'
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentDate: Date;

  @Column({ type: 'enum', enum: ['PENDENTE', 'PAGO', 'CANCELADO'], default: 'PENDENTE' })
  status: string;

  @ManyToOne(() => Student, student => student.payments)
  student: Student;

  @ManyToOne(() => Registration, registration => registration.payments)
  registration: Registration;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
