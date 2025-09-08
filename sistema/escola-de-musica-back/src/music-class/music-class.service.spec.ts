import { Test, TestingModule } from '@nestjs/testing';
import { MusicClassService } from './music-class.service';

describe('MusicClassService', () => {
  let service: MusicClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicClassService],
    }).compile();

    service = module.get<MusicClassService>(MusicClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
