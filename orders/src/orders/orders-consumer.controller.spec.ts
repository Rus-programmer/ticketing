import { Test, TestingModule } from '@nestjs/testing';
import { OrdersConsumerController } from './orders-consumer.controller';

describe('OrdersConsumerController', () => {
  let controller: OrdersConsumerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersConsumerController],
    }).compile();

    controller = module.get<OrdersConsumerController>(OrdersConsumerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
