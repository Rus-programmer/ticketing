import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreatePaymentDto,
  OrderStatus,
  Payment,
  PAYMENT_CREATED,
} from '@my-rus-package/ticketing';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Stripe } from 'stripe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { OrderPayment } from '../entities/order.payment.entity';
import { PAYMENTS_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectStripeClient() private stripeClient: Stripe,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(OrderPayment)
    private readonly orderRepository: Repository<OrderPayment>,
    @Inject(PAYMENTS_SERVICE) private client: ClientKafka,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, req: Request) {
    const { token, orderId } = createPaymentDto;

    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
    if (order.userId !== req['user'].id) {
      throw new UnauthorizedException();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestException('Cannot pay for an cancelled order');
    }

    let charge: Stripe.Response<Stripe.Charge>;
    try {
      charge = await this.stripeClient.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
      });
    } catch (e) {
      throw new BadRequestException('Payment failed:', e.message);
    }

    let payment: Payment;
    try {
      payment = this.paymentRepository.create({
        orderId,
        stripeId: charge.id,
      });
      payment = await this.paymentRepository.save(payment);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.client.emit(PAYMENT_CREATED, JSON.stringify(payment));

    return payment;
  }
}
