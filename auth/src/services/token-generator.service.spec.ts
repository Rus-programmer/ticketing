import { Test, TestingModule } from '@nestjs/testing';
import { TokenGeneratorService } from './token-generator.service';

describe('TokenGeneratorService', () => {
  let service: TokenGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenGeneratorService],
    }).compile();

    service = module.get<TokenGeneratorService>(TokenGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
