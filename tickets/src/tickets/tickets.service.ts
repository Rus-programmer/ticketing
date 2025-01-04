import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateTicketDto,
  LoggerService,
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
    private logger: LoggerService,
  ) {
    logger.setContext('TicketsService');
  }

  async create({ title, price }: CreateTicketDto, request: Request) {
    let ticket = null;
    try {
      this.logger.log('Finding ticket');
      ticket = await this.ticketRepository.findOneBy({ title });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (ticket) {
      throw new ConflictException('Ticket with such title already exists');
    }

    try {
      const userId = request['user'].id;
      this.logger.log('Creating ticket');
      ticket = this.ticketRepository.create({ title, price, userId });
      ticket = await this.ticketRepository.save(ticket);
      this.logger.log('Ticket created', JSON.stringify(ticket));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.logger.log('Emitting ticket', TICKET_CREATED);
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

    this.logger.log('Ticket found', JSON.stringify(ticket));

    return ticket;
  }

  async getTickets() {
    try {
      this.logger.log('Finding tickets');
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
      this.logger.log('Ticket updated', JSON.stringify(ticket));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.logger.log('Emitting ticket', TICKET_UPDATED);
    this.client.emit<number>(TICKET_UPDATED, JSON.stringify(ticket));

    return ticket;
  }
}
