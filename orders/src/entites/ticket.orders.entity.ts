import { Entity, PrimaryColumn } from 'typeorm';
import { TicketAbstract } from '@my-rus-package/ticketing';

@Entity('tickets')
export class TicketOrders extends TicketAbstract {
  @PrimaryColumn()
  id: number;
}
