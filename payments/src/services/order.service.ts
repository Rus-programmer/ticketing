import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderPayment } from '../entities/order.payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderPaymentsDto } from '../dtos/create-order.payments.dto';
import { CancelOrderPaymentsDto } from '../dtos/cancel-order.payments.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderPayment)
    private readonly orderRepository: Repository<OrderPayment>,
  ) {}
  async create(createOrderPaymentsDto: CreateOrderPaymentsDto) {
    let order: OrderPayment;
    try {
      order = await this.orderRepository.findOneBy({
        id: createOrderPaymentsDto.id,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (order) {
      throw new ConflictException('Such order already exists');
    }

    try {
      order = this.orderRepository.create({
        id: createOrderPaymentsDto.id,
        price: createOrderPaymentsDto.ticket.price,
        status: createOrderPaymentsDto.status,
        expiresAt: createOrderPaymentsDto.expiresAt,
        userId: createOrderPaymentsDto.userId,
      });
      order = await this.orderRepository.save(order);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return order;
  }

  async cancel(cancelOrderPaymentsDto: CancelOrderPaymentsDto) {
    let order: OrderPayment;
    try {
      order = await this.orderRepository.findOneBy({
        id: cancelOrderPaymentsDto.id,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!order) {
      throw new NotFoundException();
    }

    try {
      order = await this.orderRepository.save({
        ...order,
        status: cancelOrderPaymentsDto.status,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return order;
  }
}
