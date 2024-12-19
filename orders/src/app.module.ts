import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import environmentValidation from './config/environment.validation';
import databaseConfig from './config/database.config';
import {
  AuthGuard,
  jwtConfig,
  KafkaTopicsService,
} from '@my-rus-package/ticketing';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import kafkaConfig from './config/kafka.config';
import { ORDERS_SERVICE } from './constants/kafka.constants';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './orders/orders.module';
import { TicketsService } from './services/tickets.service';

@Module({
  imports: [
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
    ClientsModule.register([
      {
        name: ORDERS_SERVICE,
        ...kafkaConfig,
      },
    ]),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    KafkaTopicsService,
  ],
})
export class AppModule {}
