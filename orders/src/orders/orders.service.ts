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
  PaymentCreatedDto,
  LoggerService,
  ORDER_COMPLETED,
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
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('OrdersService');
  }

  async getOrders() {
    try {
      this.logger.log('Finding orders with ticket relation');
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

    this.logger.log('Ticket found ' + JSON.stringify(ticket));

    let order: OrderOrders;
    try {
      this.logger.log('Finding order');
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
    this.logger.log('Expiration set to ' + JSON.stringify(expiration));

    let newOrder: OrderOrders;
    try {
      this.logger.log('creating order');
      newOrder = this.orderRepository.create({
        ticket,
        status: OrderStatus.Created,
        expiresAt: expiration,
        userId: request['user']?.id,
      });
      newOrder = await this.orderRepository.save(newOrder);
      this.logger.log('Order created ' + JSON.stringify(newOrder));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.logger.log('Emitting created order');
    this.client.emit(ORDER_CREATED, JSON.stringify(newOrder));

    return newOrder;
  }

  async getById(id: number) {
    let order: OrderOrders;
    try {
      this.logger.log('Finding order by id ' + id + ' with ticket relation');
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

    this.logger.log('Order found ' + JSON.stringify(order));

    return order;
  }

  async cancel(id: number) {
    const order = await this.updateStatus(id, OrderStatus.Cancelled);

    const stringified = JSON.stringify(order);
    this.logger.log('Order cancelled ' + stringified);
    this.logger.log('Emitting kafka event ' + ORDER_CANCELLED);
    this.client.emit(ORDER_CANCELLED, stringified);

    return order;
  }

  async complete(paymentCreatedDto: PaymentCreatedDto) {
    const order = await this.updateStatus(
      paymentCreatedDto.orderId,
      OrderStatus.Complete,
    );

    const stringified = JSON.stringify(order);
    this.logger.log('Order completed ' + stringified);
    this.logger.log('Emitting kafka event ' + ORDER_COMPLETED);
    this.client.emit(ORDER_COMPLETED, stringified);

    return order;
  }

  async updateStatus(id: number, status: OrderStatus) {
    this.logger.log('Finding order by id ' + id);
    let order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new BadRequestException('Such order does not exist');
    }

    this.logger.log('Order found');

    try {
      this.logger.log('Updating to status ' + status);
      order = await this.orderRepository.save({
        ...order,
        status,
      });
      this.logger.log('Order updated ' + JSON.stringify(order));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return order;
  }
}
