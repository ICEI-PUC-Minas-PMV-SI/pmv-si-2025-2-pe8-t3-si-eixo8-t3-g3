import { Test, TestingModule } from '@nestjs/testing';
import { MusicClassController } from './music-class.controller';

describe('MusicClassController', () => {
  let controller: MusicClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicClassController],
    }).compile();

    controller = module.get<MusicClassController>(MusicClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
