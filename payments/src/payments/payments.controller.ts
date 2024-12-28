import {
  CreatePaymentDto,
  Order,
  ORDER_CANCELLED,
  ORDER_CREATED,
} from '@my-rus-package/ticketing';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { EventPattern } from '@nestjs/microservices';
import { OrderService } from '../services/order.service';
import { CreateOrderPaymentsDto } from '../dtos/create-order.payments.dto';
import { CancelOrderPaymentsDto } from '../dtos/cancel-order.payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentsService,
    private readonly orderService: OrderService,
  ) {}
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    return this.paymentService.create(createPaymentDto, req);
  }

  @EventPattern(ORDER_CREATED)
  async createOrder(@Body() createOrderPaymentsDto: CreateOrderPaymentsDto) {
    console.log('order created');
    await this.orderService.create(createOrderPaymentsDto);
  }

  @EventPattern(ORDER_CANCELLED)
  async cancelOrder(@Body() cancelOrderPaymentsDto: CancelOrderPaymentsDto) {
    await this.orderService.cancel(cancelOrderPaymentsDto);
  }
}
