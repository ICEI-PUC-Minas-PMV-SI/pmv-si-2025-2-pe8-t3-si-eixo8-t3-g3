import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicClassDto } from './create-music-class.dto';

export class UpdateMusicClassDto extends PartialType(CreateMusicClassDto) {}