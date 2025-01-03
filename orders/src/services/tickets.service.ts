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
  UpdateTicketOrdersDto,
} from '@my-rus-package/ticketing';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketOrders)
    private readonly ticketRepository: Repository<TicketOrders>,
  ) {}

  async create(createTicketOrdersDto: CreateTicketOrdersDto) {
    let ticket: TicketOrders;
    try {
      ticket = await this.ticketRepository.findOne({
        where: { id: createTicketOrdersDto.id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (ticket) {
      throw new ConflictException('Ticket with this title already exists');
    }

    try {
      const newTicket = this.ticketRepository.create(createTicketOrdersDto);
      return await this.ticketRepository.save(newTicket);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(updateTicketOrdersDto: UpdateTicketOrdersDto) {
    let ticket: TicketOrders;
    try {
      ticket = await this.ticketRepository.findOne({
        where: { id: updateTicketOrdersDto.id },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!ticket) {
      throw new BadRequestException('Such ticket does not exist');
    }

    try {
      ticket = await this.ticketRepository.save({
        ...ticket,
        ...updateTicketOrdersDto,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return ticket;
  }

  async getByTitle(title: string) {
    let ticket: TicketOrders;
    try {
      ticket = await this.ticketRepository.findOne({
        where: { title },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }
    return ticket;
  }
}
