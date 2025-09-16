import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Registration } from 'src/entities/registration.entity';
import { Student } from 'src/entities/student.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { studentId, registrationId, ...paymentData } = createPaymentDto;

    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const registration = await this.registrationRepository.findOne({ where: { id: registrationId } });
    if (!registration) {
      throw new NotFoundException(`Registration with ID ${registrationId} not found.`);
    }

    const newPayment = this.paymentRepository.create({
      ...paymentData,
      student,
      registration,
    });

    return this.paymentRepository.save(newPayment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['student', 'student.user', 'registration'] });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['student', 'registration'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    this.paymentRepository.merge(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
  }
}