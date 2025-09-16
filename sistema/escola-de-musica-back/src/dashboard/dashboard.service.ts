import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Student } from 'src/entities/student.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { MusicClass } from 'src/entities/music-class.entity';
import { Payment, PaymentStatus } from 'src/entities/payment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(MusicClass)
    private readonly musicClassRepository: Repository<MusicClass>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getMetrics() {
    const totalStudents = await this.studentRepository.count();
    const totalTeachers = await this.teacherRepository.count();
    const totalMusicClasses = await this.musicClassRepository.count();
    const pendingPayments = await this.paymentRepository.count({ where: { status: PaymentStatus.PENDENTE } });

    return {
      totalStudents,
      totalTeachers,
      totalMusicClasses,
      pendingPayments,
    };
  }

  async getNewStudentsData() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const newStudentsByMonth = [];
    const today = new Date();
    
    // Obter dados dos últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const count = await this.studentRepository.count({
        where: { createdAt: Between(startOfMonth, endOfMonth) },
      });
      newStudentsByMonth.push(count);
    }
    
    const recentMonths = months.slice(today.getMonth() - 5 < 0 ? 12 + (today.getMonth() - 5) : today.getMonth() - 5, today.getMonth() + 1);

    return {
      series: newStudentsByMonth,
      categories: recentMonths,
    };
  }

  async getRecentEvents() {
    const recentStudents = await this.studentRepository.find({
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['user'],
    });

    const recentPayments = await this.paymentRepository.find({
      where: { status: 'PENDENTE' },
      order: { paymentDate: 'DESC' },
      take: 2,
      relations: ['student', 'student.user'],
    });

    const recentClasses = await this.musicClassRepository.find({
      order: { createdAt: 'DESC' },
      take: 2,
      relations: ['teacher', 'teacher.user', 'students', 'students.user', 'instruments'],
    });

    const events = [];

    recentStudents.forEach(student => {
      events.push({
        icon: 'mdi-account-plus',
        title: `Novo aluno matriculado: ${student.user.name}`,
        subtitle: `ID da matrícula: ${student.id}`,
      });
    });

    recentPayments.forEach(payment => {
      events.push({
        icon: 'mdi-cash-remove',
        title: `Pagamento pendente: ${payment.student.user.name}`,
        subtitle: `Vencimento: ${new Date(payment.paymentDate).toLocaleDateString('pt-BR')}`,
      });
    });
console.log(recentClasses)
    recentClasses.forEach(musicClass => {
      events.push({
        icon: 'mdi-calendar-check',
        title: `Turma criada: ${musicClass.name}`,
        subtitle: `Professor: ${musicClass.teacher.user.name}`,
      });
    });

    return events;
  }
}