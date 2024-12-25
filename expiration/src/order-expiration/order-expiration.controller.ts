import { BadRequestException, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ORDER_CREATED, OrderExpireDto } from '@my-rus-package/ticketing';
import { ProducersService } from './producers/producers.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('order-expiration')
export class OrderExpirationController {
  constructor(private readonly producersService: ProducersService) {}

  @EventPattern(ORDER_CREATED)
  async handleEvent(order: OrderExpireDto) {
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
