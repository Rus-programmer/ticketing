import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  refreshTokenTtl: process.env.JWT_REFRESH_TTL,
  accessTokenTtl: process.env.JWT_ACCESS_TTL,
}));
