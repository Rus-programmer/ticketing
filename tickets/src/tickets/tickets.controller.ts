import {
  Auth,
  AuthType,
  CreateTicketDto,
  LoggerService,
  UpdateTicketDto,
} from '@my-rus-package/ticketing';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(
    private ticketService: TicketsService,
    private logger: LoggerService,
  ) {
    logger.setContext('TicketsController');
  }

  @Post()
  createTicket(
    @Req() request: Request,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    this.logger.log('Creating ticket');
    return this.ticketService.create(createTicketDto, request);
  }

  @Auth(AuthType.None)
  @Get()
  getTickets() {
    this.logger.log('Getting tickets');
    return this.ticketService.getTickets();
  }

  @Get(':id')
  getTicket(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('Getting ticket by id');
    return this.ticketService.getById(id);
  }

  @Put(':id')
  updateTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    this.logger.log('Getting ticket by id');
    return this.ticketService.update(id, updateTicketDto);
  }
}
