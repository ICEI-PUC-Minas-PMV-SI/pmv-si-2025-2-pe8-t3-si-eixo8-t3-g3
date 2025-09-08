import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { MusicClassService } from './music-class.service';
import { CreateMusicClassDto } from './dtos/create-music-class.dto';
import { UpdateMusicClassDto } from './dtos/update-music-class.dto';

@Controller('music-classes')
export class MusicClassController {
  constructor(private readonly musicClassService: MusicClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMusicClassDto: CreateMusicClassDto) {
    return this.musicClassService.create(createMusicClassDto);
  }

  @Get()
  findAll() {
    return this.musicClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicClassDto: UpdateMusicClassDto) {
    return this.musicClassService.update(+id, updateMusicClassDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.musicClassService.remove(+id);
  }
}