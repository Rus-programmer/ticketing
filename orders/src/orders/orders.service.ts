import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderOrders } from '../entites/order.orders.entity';
import { In, Repository } from 'typeorm';
import {
  CreateOrderDto,
  ORDER_CANCELLED,
  ORDER_CREATED,
  OrderStatus,
} from '@my-rus-package/ticketing';
import { TicketOrders } from '../entites/ticket.orders.entity';
import { EXPIRATION_WINDOW_SECONDS } from '../constants/expiration.constants';
import { ORDERS_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderOrders)
    private readonly orderRepository: Repository<OrderOrders>,
    @InjectRepository(TicketOrders)
    private readonly ticketRepository: Repository<TicketOrders>,
    @Inject(ORDERS_SERVICE) private readonly client: ClientKafka,
  ) {}

  async getOrders() {
    try {
      return await this.orderRepository.find({
        relations: ['ticket'],
      });
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
      newOrder = await this.orderRepository.save(newOrder);
      this.client.emit(ORDER_CREATED, JSON.stringify(newOrder));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return newOrder;
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

  async cancel(id: number) {
    let order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new BadRequestException('Such order does not exist');
    }

    try {
      order = await this.orderRepository.save({
        ...order,
        status: OrderStatus.Cancelled,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.client.emit(ORDER_CANCELLED, JSON.stringify(order));

    return order;
  }
}
