import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TicketsService } from '../services/tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketOrders } from '../entites/ticket.orders.entity';
import { OrderOrders } from '../entites/order.orders.entity';
import { OrdersConsumerController } from './orders-consumer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketOrders, OrderOrders])],
  providers: [OrdersService, TicketsService],
  controllers: [OrdersController, OrdersConsumerController],
})
export class OrdersModule {}
