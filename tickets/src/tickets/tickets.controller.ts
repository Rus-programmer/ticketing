import {
  Auth,
  AuthType,
  CreateTicketDto,
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
  constructor(private ticketService: TicketsService) {}

  @Post()
  createTicket(
    @Req() request: Request,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return this.ticketService.create(createTicketDto, request);
  }

  @Auth(AuthType.None)
  @Get()
  getTickets() {
    return this.ticketService.getTickets();
  }

  @Get(':id')
  getTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.getById(id);
  }

  @Put(':id')
  updateTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }
}
