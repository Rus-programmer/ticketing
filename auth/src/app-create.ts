import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import kafkaConfig from './config/kafka.config';
import { Kafka } from 'kafkajs';

export default async function (app: INestApplication) {
  const configService = app.get(ConfigService);
  app.use(
    session({
      secret: configService.get('appConfig.sessionSecret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
    }),
  );

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
