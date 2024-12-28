import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import environmentValidation from './config/environment.validation';
import databaseConfig from './config/database.config';
import {
  AuthGuard,
  jwtConfig,
  KafkaTopicsService,
} from '@my-rus-package/ticketing';
import { PaymentsModule } from './payments/payments.module';
import stripeConfig from './config/stripe.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, stripeConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider() as any),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.accessTokenSecret,
      }),
    }),
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KafkaTopicsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
