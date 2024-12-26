import { INestApplication } from '@nestjs/common';
import kafkaConfig from './config/kafka.config';

export default async function (app: INestApplication) {
  app.connectMicroservice(kafkaConfig, {
    inheritAppConfig: true,
  });
  await app.startAllMicroservices();
}
