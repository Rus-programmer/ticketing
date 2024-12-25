import { INestApplication } from '@nestjs/common';
import kafkaConfig from './config/kafka.config';

export const appCreate = async (app: INestApplication) => {
  app.connectMicroservice(kafkaConfig);
  await app.startAllMicroservices();
};
