import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateTicketDto,
  TicketTickets,
  UpdateTicketDto,
} from '@my-rus-package/ticketing';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketTickets)
    private readonly ticketRepository: Repository<TicketTickets>,
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
      return ticket;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
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
    const ticket = await this.getById(id);

    try {
      return await this.ticketRepository.save({
        id: ticket.id,
        ...ticket,
        ...updateTicketDto,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
