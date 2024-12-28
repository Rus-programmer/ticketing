import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TicketsService } from '../services/tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketOrders } from '../entites/ticket.orders.entity';
import { OrderOrders } from '../entites/order.orders.entity';
import { OrdersConsumerController } from './orders-consumer.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ORDERS_SERVICE } from '../constants/kafka.constants';
import kafkaConfig from '../config/kafka.config';
import { LoggerModule } from '@my-rus-package/ticketing';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([TicketOrders, OrderOrders]),
    ClientsModule.register([
      {
        name: ORDERS_SERVICE,
        ...kafkaConfig,
      },
    ]),
  ],
  providers: [OrdersService, TicketsService],
  controllers: [OrdersController, OrdersConsumerController],
})
export class OrdersModule {}
