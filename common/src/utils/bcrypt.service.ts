import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService extends HashingService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
  }
}
