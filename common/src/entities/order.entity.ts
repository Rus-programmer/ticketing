import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderAbstract } from './order.abstract.entity';

@Entity('orders')
export class Order extends OrderAbstract {
  @PrimaryGeneratedColumn()
  id: number;
}
