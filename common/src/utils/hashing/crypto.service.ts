import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { HashingService } from './hashing.service';

@Injectable()
export class CryptoService extends HashingService {
  hashPassword(password: string, { key, iv }: Record<string, string>): string {
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(password, 'utf8'),
      cipher.final(),
    ]);
    return encrypted.toString('hex');
  }
  comparePassword(
    password: string,
    encryptedPassword: string,
    { key, iv }: Record<string, string>,
  ): boolean {
    const decryptedPassword = this.decrypt(encryptedPassword, key, iv);
    return password === decryptedPassword;
  }

  private decrypt(encryptedPassword: string, key: string, iv: string) {
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedPassword, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }
}
