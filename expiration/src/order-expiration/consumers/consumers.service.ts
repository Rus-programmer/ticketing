import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EXPIRATION_ORDER, ORDER } from '../../constants/queue.constants';
import { Job } from 'bullmq';
import { EXPIRATION_SERVICE } from '../../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import { ORDER_EXPIRED } from '@my-rus-package/ticketing';

@Injectable()
@Processor(EXPIRATION_ORDER)
export class ConsumersService extends WorkerHost {
  constructor(
    @Inject(EXPIRATION_SERVICE) private readonly client: ClientKafka,
  ) {
    super();
  }

  process(job: Job): Promise<any> {
    switch (job.name) {
      case ORDER: {
        this.handleExpiredOrder(job.data.id);
        break;
      }
      default: {
        throw new BadRequestException('There is no such job');
      }
    }
    return;
  }

  handleExpiredOrder(id: number) {
    this.client.emit(ORDER_EXPIRED, id);
  }
}
