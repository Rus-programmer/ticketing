import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { EXPIRATION_ORDER, ORDER } from '../../constants/queue.constants';
import { OrderExpireDto } from '@my-rus-package/ticketing';

@Injectable()
export class ProducersService {
  constructor(@InjectQueue(EXPIRATION_ORDER) private orderQueue: Queue) {}

  async createOrderQueue(order: OrderExpireDto) {
    const delay = order.expiresAt.getTime() - new Date().getTime();
    await this.orderQueue.add(ORDER, { id: order.id }, { delay });
  }
}
