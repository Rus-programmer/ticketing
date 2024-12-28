import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  ORDER_EXPIRED,
  PAYMENT_CREATED,
  PaymentCreatedDto,
} from '@my-rus-package/ticketing';
import { EventPattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getById(id);
  }

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    return this.ordersService.create(createOrderDto, request);
  }

  @EventPattern(ORDER_EXPIRED)
  async cancelOrder(id: number) {
    try {
      await this.ordersService.cancel(id);
    } catch (e) {
      console.error(e.message);
    }
  }

  @EventPattern(PAYMENT_CREATED)
  async completeOrder(@Body() paymentCreatedDto: PaymentCreatedDto) {
    try {
      await this.ordersService.complete(paymentCreatedDto);
    } catch (e) {
      console.error(e.message);
    }
  }
}
