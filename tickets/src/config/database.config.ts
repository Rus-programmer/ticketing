import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  username: 'postgres',
  type: 'postgres',
  autoLoadEntities: true,
  host: process.env.DATABASE_HOST,
  synchronize: true,
}));
