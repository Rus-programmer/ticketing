import { INestApplication, ValidationPipe } from '@nestjs/common';
import kafkaConfig from './config/kafka.config';

export default async function (app: INestApplication) {
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
