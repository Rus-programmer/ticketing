import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environmentValidation from './config/environment.validation';
import databaseConfig from './config/database.config';
import {
  AuthGuard,
  ExceptionLoggerFilter,
  jwtConfig,
  KafkaTopicsService,
  LoggerModule,
  RpcExFilter,
} from '@my-rus-package/ticketing';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentValidation,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider() as any),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        secret: configService.get('jwt.accessTokenSecret'),
      }),
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: RpcExFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionLoggerFilter,
    },
    KafkaTopicsService,
  ],
})
export class AppModule {}
