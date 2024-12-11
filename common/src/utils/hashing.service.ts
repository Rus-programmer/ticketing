import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export abstract class HashingService {
  abstract hashPassword(
    password: string,
    options?: Record<string, string>,
  ): Promise<string> | string;

  abstract comparePassword(
    password: string,
    encryptedPassword: string,
    options?: Record<string, string>,
  ): Promise<boolean> | boolean;
}
