import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

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
