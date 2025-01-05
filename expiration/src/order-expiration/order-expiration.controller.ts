import { BadRequestException, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
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
  async handleEvent(order: OrderExpireDto) {
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
  }
}
