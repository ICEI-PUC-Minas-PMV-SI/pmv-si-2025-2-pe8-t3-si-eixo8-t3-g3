import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany, Column } from 'typeorm';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';
import { MusicClass } from './music-class.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  hireDate?: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Instrument, instrument => instrument.teachers)
  @JoinTable()
  instruments: Instrument[];

  @OneToMany(() => MusicClass, musicClass => musicClass.teacher)
  musicClasses: MusicClass[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
