import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appCreate from './app-create';
import { KafkaTopicsService } from '@my-rus-package/ticketing';

async function bootstrap() {
  new KafkaTopicsService();
  const app = await NestFactory.create(AppModule);
  await appCreate(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
