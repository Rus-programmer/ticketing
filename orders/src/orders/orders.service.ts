import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderOrders } from '../entites/order.orders.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto, OrderStatus } from '@my-rus-package/ticketing';
import { TicketOrders } from '../entites/ticket.orders.entity';
import { EXPIRATION_WINDOW_SECONDS } from '../constants/expiration.constants';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderOrders)
    private readonly orderRepository: Repository<OrderOrders>,
    @InjectRepository(TicketOrders)
    private readonly ticketRepository: Repository<TicketOrders>,
  ) {}

  async getOrders() {
    try {
      return await this.orderRepository.find();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async create(createOrderDto: CreateOrderDto, request: Request) {
    let ticket: TicketOrders;
    try {
      ticket = await this.ticketRepository.findOneBy({
        id: createOrderDto.ticketId,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    let order: OrderOrders;
    try {
      order = await this.orderRepository.findOneBy({
        ticket,
        status: In([
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ]),
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (order) {
      throw new ConflictException('This ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    let newOrder: OrderOrders;
    try {
      newOrder = this.orderRepository.create({
        ticket,
        status: OrderStatus.Created,
        expiresAt: expiration,
        userId: request['user']?.id,
      });
      return await this.orderRepository.save(newOrder);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async getById(id: number) {
    let order: OrderOrders;
    try {
      order = await this.orderRepository.findOne({
        where: {
          id,
        },
        relations: ['ticket'],
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
