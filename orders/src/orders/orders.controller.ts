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
  LoggerService,
  ORDER_EXPIRED,
  PAYMENT_CREATED,
  PaymentCreatedDto,
} from '@my-rus-package/ticketing';
import { EventPattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private logger: LoggerService,
  ) {
    logger.setContext('OrdersController');
  }

  @Get()
  getOrders() {
    this.logger.log('Getting orders');
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('Getting order by id ' + id);
    return this.ordersService.getById(id);
  }

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    this.logger.log('Create order ' + JSON.stringify(createOrderDto));
    return this.ordersService.create(createOrderDto, request);
  }

  @EventPattern(ORDER_EXPIRED)
  async cancelOrder(id: number) {
    try {
      this.logger.log('Order expired kafka event to id ' + id);
      await this.ordersService.cancel(id);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  @EventPattern(PAYMENT_CREATED)
  async completeOrder(@Body() paymentCreatedDto: PaymentCreatedDto) {
    try {
      this.logger.log(
        'Payment created kafka event ' + JSON.stringify(paymentCreatedDto),
      );
      await this.ordersService.complete(paymentCreatedDto);
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
