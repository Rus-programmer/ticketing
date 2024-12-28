import { Column, Entity, PrimaryColumn } from 'typeorm';
import { OrderAbstract } from '@my-rus-package/ticketing';

@Entity('orders')
export class OrderPayment extends OrderAbstract {
  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: false,
  })
  price: number;

  @PrimaryColumn()
  id: number;
}
