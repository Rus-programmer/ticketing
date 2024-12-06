import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  sessionSecret: process.env.SESSION_SECRET,
}));
