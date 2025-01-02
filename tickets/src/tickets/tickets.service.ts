import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateTicketDto,
  TICKET_CREATED,
  TICKET_UPDATED,
  UpdateTicketDto,
} from '@my-rus-package/ticketing';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { TICKETS_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import { TicketTickets } from '../entities/ticket.tickets.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketTickets)
    private readonly ticketRepository: Repository<TicketTickets>,
    @Inject(TICKETS_SERVICE) private readonly client: ClientKafka,
  ) {}

  async create({ title, price }: CreateTicketDto, request: Request) {
    let ticket = null;
    try {
      ticket = await this.ticketRepository.findOneBy({ title });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (ticket) {
      throw new ConflictException('Ticket with such title already exists');
    }

    try {
      const userId = request['user'].id;
      ticket = this.ticketRepository.create({ title, price, userId });
      await this.ticketRepository.save(ticket);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.client.emit<number>(TICKET_CREATED, JSON.stringify(ticket));

    return ticket;
  }

  async getById(id: number) {
    let ticket = null;
    try {
      ticket = await this.ticketRepository.findOneBy({ id });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!ticket) {
      throw new BadRequestException('Ticket with that id does not exist');
    }
    return ticket;
  }

  async getTickets() {
    try {
      return await this.ticketRepository.find({});
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    let ticket = await this.getById(id);

    try {
      ticket = await this.ticketRepository.save({
        id: ticket.id,
        ...ticket,
        ...updateTicketDto,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.client.emit<number>(TICKET_UPDATED, JSON.stringify(ticket));

    return ticket;
  }
}
