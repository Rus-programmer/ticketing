import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { OrderExpirationModule } from './order-expiration/order-expiration.module';
import { KafkaTopicsService, RpcExFilter } from '@my-rus-package/ticketing';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis-srv',
        port: 6379,
      },
      defaultJobOptions: {
        // removeOnComplete: true,
        // removeOnFail: true,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        attempts: 3,
      },
    }),
    OrderExpirationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KafkaTopicsService,
    {
      provide: APP_FILTER,
      useClass: RpcExFilter,
    },
  ],
})
export class AppModule {}
