import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { CryptoService } from './crypto.service';
import { HashingService } from './hashing.service';

@Module({
  providers: [
    BcryptService,
    CryptoService,
    {
      provide: HashingService,
      useClass: CryptoService,
    },
  ],
  exports: [HashingService],
})
export class HashingModule {}
