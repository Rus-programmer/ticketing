import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  binaryKey: process.env.BINARY_KEY,
}));
