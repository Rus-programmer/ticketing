import { Column, Entity } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity({
  name: 'tickets',
})
export class TicketTickets extends Ticket {
  @Column({
    type: 'int',
    unique: true,
    nullable: true,
  })
  orderId?: number;
}
