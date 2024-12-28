import { Column } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

export abstract class OrderAbstract {
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Created,
  })
  status: OrderStatus;

  @Column({
    nullable: false,
    type: 'timestamptz',
  })
  expiresAt: Date;

  @Column({
    type: 'int',
    nullable: false,
    update: false,
  })
  userId: number;
}
