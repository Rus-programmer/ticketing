import { INestApplication } from '@nestjs/common';
import { kafkaConfig } from './config/kafka.config';
import * as cookieParser from 'cookie-parser';

export async function appCreate(app: INestApplication) {
  app.use(cookieParser());
  app.connectMicroservice(kafkaConfig, { inheritAppConfig: true });
  await app.startAllMicroservices();
}
