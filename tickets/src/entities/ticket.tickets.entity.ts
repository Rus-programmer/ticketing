import { Column, Entity } from 'typeorm';
import { Order, Ticket } from '@my-rus-package/ticketing';

@Entity('tickets')
export class TicketTickets extends Ticket {
  @Column({
    type: 'int',
    unique: true,
    nullable: true,
  })
  order?: Order;
}
