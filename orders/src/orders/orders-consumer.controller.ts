import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  CreateTicketOrdersDto,
  RpcTransformer,
  TICKET_CREATED,
} from '@my-rus-package/ticketing';
import { TicketsService } from '../services/tickets.service';

@Controller()
export class OrdersConsumerController {
  constructor(private readonly ticketService: TicketsService) {}

  @EventPattern(TICKET_CREATED)
  @RpcTransformer()
  async createTicket(@Payload() createTicketOrdersDto: CreateTicketOrdersDto) {
    await this.ticketService.create(createTicketOrdersDto);
  }
}
