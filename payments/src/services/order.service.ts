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
import { UpdateOrderPaymentsDto } from '../dtos/update-order.payments.dto';
import { LoggerService } from '@my-rus-package/ticketing';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderPayment)
    private readonly orderRepository: Repository<OrderPayment>,
    private readonly logger: LoggerService,
  ) {
    logger.setContext('OrderService');
  }

  async create(createOrderPaymentsDto: CreateOrderPaymentsDto) {
    let order: OrderPayment;
    try {
      this.logger.log('Finding order by id ' + createOrderPaymentsDto.id);
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
      this.logger.log('Creating order');
      order = this.orderRepository.create({
        id: createOrderPaymentsDto.id,
        price: createOrderPaymentsDto.ticket.price,
        status: createOrderPaymentsDto.status,
        expiresAt: createOrderPaymentsDto.expiresAt,
        userId: createOrderPaymentsDto.userId,
      });
      order = await this.orderRepository.save(order);
      this.logger.log('Order created ' + JSON.stringify(order));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return order;
  }

  async update(updateOrderPaymentsDto: UpdateOrderPaymentsDto) {
    let order: OrderPayment;
    try {
      this.logger.log('Finding order by id ' + updateOrderPaymentsDto.id);
      order = await this.orderRepository.findOneBy({
        id: updateOrderPaymentsDto.id,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!order) {
      throw new NotFoundException();
    }

    this.logger.log('Order found');

    try {
      this.logger.log('Updating order');
      order = await this.orderRepository.save({
        ...order,
        status: updateOrderPaymentsDto.status,
      });
      this.logger.log('Order updated');
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return order;
  }
}
