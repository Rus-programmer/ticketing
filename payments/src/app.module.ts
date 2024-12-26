import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import environmentValidation from './config/environment.validation';
import databaseConfig from './config/database.config';
import { jwtConfig, KafkaTopicsService } from '@my-rus-package/ticketing';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      validationSchema: environmentValidation,
    }),
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, KafkaTopicsService],
})
export class AppModule {}
