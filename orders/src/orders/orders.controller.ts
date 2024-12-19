import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { TicketsService } from '../services/tickets.service';
import {
  CreateTicketOrdersDto,
  RpcTransformer,
  TICKET_CREATED,
} from '@my-rus-package/ticketing';
import { CreateOrderDto } from '@my-rus-package/ticketing';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ticketService: TicketsService,
  ) {}

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    console.log('ffkdljdljfvmcx,.vmxc');
    return this.ordersService.getById(id);
  }

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    return this.ordersService.create(createOrderDto, request);
  }

  @EventPattern(TICKET_CREATED)
  @RpcTransformer()
  async createTicket(@Payload() createTicketOrdersDto: CreateTicketOrdersDto) {
    await this.ticketService.create(createTicketOrdersDto);
  }
}
