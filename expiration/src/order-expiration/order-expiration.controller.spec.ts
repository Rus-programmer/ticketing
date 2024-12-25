import { Test, TestingModule } from '@nestjs/testing';
import { OrderExpirationController } from './order-expiration.controller';

describe('OrderExpirationController', () => {
  let controller: OrderExpirationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderExpirationController],
    }).compile();

    controller = module.get<OrderExpirationController>(OrderExpirationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
