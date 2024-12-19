import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TicketAbstract } from './ticket.abstract.entity';

@Entity('tickets')
export class Ticket extends TicketAbstract {
  @PrimaryGeneratedColumn()
  id: number;
}
