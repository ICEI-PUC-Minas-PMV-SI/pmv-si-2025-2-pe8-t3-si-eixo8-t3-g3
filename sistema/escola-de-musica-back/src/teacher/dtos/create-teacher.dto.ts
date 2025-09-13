import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
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

  @IsString()
  @IsOptional()
  hireDate?: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  instrumentIds?: number[];
}