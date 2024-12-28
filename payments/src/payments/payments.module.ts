import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PAYMENTS_SERVICE } from '../constants/kafka.constants';
import { ClientsModule } from '@nestjs/microservices';
import kafkaConfig from '../config/kafka.config';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { ConfigModule, ConfigType } from '@nestjs/config';
import stripeConfig from '../config/stripe.config';
import { Payment } from '@my-rus-package/ticketing';
import { OrderPayment } from '../entities/order.payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../services/order.service';

@Module({
  providers: [PaymentsService, OrderService],
  controllers: [PaymentsController],
  imports: [
    TypeOrmModule.forFeature([Payment, OrderPayment]),
    ClientsModule.register([
      {
        name: PAYMENTS_SERVICE,
        ...kafkaConfig,
      },
    ]),
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      inject: [stripeConfig.KEY],
      useFactory: (config: ConfigType<typeof stripeConfig>) => ({
        apiKey: config.stripe_secret,
        apiVersion: '2024-12-18.acacia',
      }),
    }),
  ],
})
export class PaymentsModule {}
