import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { EXPIRATION_ORDER, ORDER } from '../../constants/queue.constants';
import { LoggerService, OrderExpireDto } from '@my-rus-package/ticketing';

@Injectable()
export class ProducersService {
  constructor(
    @InjectQueue(EXPIRATION_ORDER) private orderQueue: Queue,
    private readonly logger: LoggerService,
  ) {
    logger.setContext('ProducersService');
  }

  async createOrderQueue(order: OrderExpireDto) {
    const delay = order.expiresAt.getTime() - new Date().getTime();
    this.logger.log('Delay established ' + delay);
    try {
      await this.orderQueue.add(ORDER, { id: order.id }, { delay });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    this.logger.log('Added to queue');
  }
}
