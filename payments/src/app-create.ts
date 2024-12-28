import { INestApplication } from '@nestjs/common';
import kafkaConfig from './config/kafka.config';
import * as cookieParser from 'cookie-parser';

export default async function (app: INestApplication) {
  app.use(cookieParser());
  app.connectMicroservice(kafkaConfig);
  await app.startAllMicroservices();
}
