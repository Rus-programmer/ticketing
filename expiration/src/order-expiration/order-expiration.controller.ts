import { BadRequestException, Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import {
  commitOffsets,
  LoggerService,
  ORDER_CREATED,
  OrderExpireDto,
} from '@my-rus-package/ticketing';
import { ProducersService } from './producers/producers.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('order-expiration')
export class OrderExpirationController {
  constructor(
    private readonly producersService: ProducersService,
    private readonly logger: LoggerService,
  ) {
    logger.setContext('OrderExpirationController');
  }

  @EventPattern(ORDER_CREATED)
  async handleEvent(
    @Payload() order: OrderExpireDto,
    @Ctx() ctx: KafkaContext,
  ): Promise<void> {
    this.logger.log(
      ORDER_CREATED + ' kafka event received ' + JSON.stringify(order),
    );
    const orderDto = plainToInstance(OrderExpireDto, order);

    const errors = await validate(orderDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        `Validation failed: ${JSON.stringify(errors)}`,
      );
    }

    await this.producersService.createOrderQueue(orderDto);

    commitOffsets(ctx);
  }
}
