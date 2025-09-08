import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  cellphone?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  password: string;
}