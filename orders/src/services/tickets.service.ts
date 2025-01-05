import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketOrders } from '../entites/ticket.orders.entity';
import { Repository } from 'typeorm';
import {
  CreateTicketOrdersDto,
  LoggerService,
  UpdateTicketOrdersDto,
} from '@my-rus-package/ticketing';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketOrders)
    private readonly ticketRepository: Repository<TicketOrders>,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('TicketsService');
  }

  async create(createTicketOrdersDto: CreateTicketOrdersDto) {
    let ticket: TicketOrders;
    try {
      this.logger.log('Finding ticket by id ' + createTicketOrdersDto.id);
      ticket = await this.ticketRepository.findOne({
        where: { id: createTicketOrdersDto.id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (ticket) {
      throw new ConflictException('Ticket with this id already exists');
    }

    try {
      this.logger.log('Creating ticket');
      let newTicket = this.ticketRepository.create(createTicketOrdersDto);
      newTicket = await this.ticketRepository.save(newTicket);
      this.logger.log('Ticket created ' + JSON.stringify(newTicket));
      return newTicket;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(updateTicketOrdersDto: UpdateTicketOrdersDto) {
    let ticket: TicketOrders;
    try {
      this.logger.log('Finding ticket by id ' + updateTicketOrdersDto.id);
      ticket = await this.ticketRepository.findOne({
        where: { id: updateTicketOrdersDto.id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!ticket) {
      throw new BadRequestException('Such ticket does not exist');
    }

    this.logger.log('Ticket found');

    try {
      this.logger.log('Updating');
      ticket = await this.ticketRepository.save({
        ...ticket,
        ...updateTicketOrdersDto,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    this.logger.log('Ticket updated ' + JSON.stringify(ticket));

    return ticket;
  }

  async getByTitle(title: string) {
    let ticket: TicketOrders;
    try {
      this.logger.log('Finding ticket by title ' + title);
      ticket = await this.ticketRepository.findOne({
        where: { title },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }

    this.logger.log('Ticket found ' + JSON.stringify(ticket));

    return ticket;
  }
}
