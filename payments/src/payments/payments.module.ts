import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PAYMENTS_SERVICE } from '../constants/kafka.constants';
import { ClientsModule } from '@nestjs/microservices';
import kafkaConfig from '../config/kafka.config';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [
    ClientsModule.register([
      {
        name: PAYMENTS_SERVICE,
        ...kafkaConfig,
      },
    ]),
  ],
})
export class PaymentsModule {}
