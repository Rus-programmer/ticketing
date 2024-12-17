import { INestApplication, ValidationPipe } from '@nestjs/common';
import kafkaConfig from './config/kafka.config';
import * as cookieParser from 'cookie-parser';

export default async function (app: INestApplication) {
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.connectMicroservice(kafkaConfig, {
    inheritAppConfig: true,
  });
  await app.startAllMicroservices();
}
