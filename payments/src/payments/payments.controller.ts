import {
  CreatePaymentDto,
  LoggerService,
  ORDER_CANCELLED,
  ORDER_COMPLETED,
  ORDER_CREATED,
} from '@my-rus-package/ticketing';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from '../services/order.service';
import { CreateOrderPaymentsDto } from '../dtos/create-order.payments.dto';
import { UpdateOrderPaymentsDto } from '../dtos/update-order.payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentsService,
    private readonly orderService: OrderService,
    private readonly logger: LoggerService,
  ) {
    logger.setContext('PaymentsController');
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    this.logger.log('Creating new payment');
    return this.paymentService.create(createPaymentDto, req);
  }

  @EventPattern(ORDER_CREATED)
  async createOrder(@Payload() createOrderPaymentsDto: CreateOrderPaymentsDto) {
    this.logger.log(
      `${ORDER_CREATED} kafka event received ${JSON.stringify(createOrderPaymentsDto)}`,
    );
    await this.orderService.create(createOrderPaymentsDto);
  }

  @EventPattern(ORDER_CANCELLED)
  async cancelOrder(@Payload() updateOrderPaymentsDto: UpdateOrderPaymentsDto) {
    this.logger.log(
      `${ORDER_CANCELLED} kafka event received ${JSON.stringify(updateOrderPaymentsDto)}`,
    );
    await this.orderService.update(updateOrderPaymentsDto);
  }

  @EventPattern(ORDER_COMPLETED)
  async completeOrder(
    @Payload() updateOrderPaymentsDto: UpdateOrderPaymentsDto,
  ) {
    this.logger.log(
      `${ORDER_COMPLETED} kafka event received ${JSON.stringify(updateOrderPaymentsDto)}`,
    );
    await this.orderService.update(updateOrderPaymentsDto);
  }
}
