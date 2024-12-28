import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  stripe_secret: process.env.STRIPE_KEY,
}));
