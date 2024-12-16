import { INestApplication } from '@nestjs/common';
import { kafkaConfig } from './config/kafka.config';

export async function appCreate(app: INestApplication) {
  app.connectMicroservice(kafkaConfig, { inheritAppConfig: true });
  await app.startAllMicroservices();
}
