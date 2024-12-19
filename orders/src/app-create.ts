import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import kafkaConfig from './config/kafka.config';

export const appCreate = async (app: INestApplication) => {
  app.use(cookieParser());
  app.connectMicroservice(kafkaConfig);
  await app.startAllMicroservices();
};
