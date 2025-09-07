import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInstrumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}