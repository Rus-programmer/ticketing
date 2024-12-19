import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { TicketOrders } from './ticket.orders.entity';
import { Order } from '@my-rus-package/ticketing';

@Entity('orders')
export class OrderOrders extends Order {
  @OneToOne(() => TicketOrders, { onDelete: 'CASCADE' })
  @JoinColumn()
  ticket: TicketOrders;
}
