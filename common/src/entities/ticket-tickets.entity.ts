import { Column, Entity } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Order } from './order.entity';

@Entity('tickets')
export class TicketTickets extends Ticket {
  @Column({
    type: 'int',
    unique: true,
    nullable: true,
  })
  order?: Order;
}
