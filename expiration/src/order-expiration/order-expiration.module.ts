import { Module } from '@nestjs/common';
import { ConsumersService } from './consumers/consumers.service';
import { ProducersService } from './producers/producers.service';
import { BullModule } from '@nestjs/bullmq';
import { OrderExpirationController } from './order-expiration.controller';
import { ClientsModule } from '@nestjs/microservices';
import kafkaConfig from '../config/kafka.config';
import { EXPIRATION_SERVICE } from '../constants/kafka.constants';
import { EXPIRATION_ORDER } from '../constants/queue.constants';

@Module({
  providers: [ConsumersService, ProducersService],
  imports: [
    BullModule.registerQueue({
      name: EXPIRATION_ORDER,
    }),
    ClientsModule.register([
      {
        name: EXPIRATION_SERVICE,
        ...kafkaConfig,
      },
    ]),
  ],
  controllers: [OrderExpirationController],
})
export class OrderExpirationModule {}
