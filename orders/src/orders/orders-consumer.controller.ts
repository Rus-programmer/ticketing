import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import {
  commitOffsets,
  CreateTicketOrdersDto,
  LoggerService,
  RpcTransformer,
  TICKET_CREATED,
  TICKET_UPDATED,
} from '@my-rus-package/ticketing';
import { TicketsService } from '../services/tickets.service';

@Controller()
export class OrdersConsumerController {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('OrdersConsumerController');
  }

  @EventPattern(TICKET_CREATED)
  @RpcTransformer()
  async createTicket(
    @Payload() createTicketOrdersDto: CreateTicketOrdersDto,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(TICKET_CREATED + ' kafka event received');
    await this.ticketService.create(createTicketOrdersDto);

    commitOffsets(context);
  }

  @EventPattern(TICKET_UPDATED)
  @RpcTransformer()
  async updateTicket(
    @Payload() createTicketOrdersDto: CreateTicketOrdersDto,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(TICKET_UPDATED + ' kafka event received');
    await this.ticketService.update(createTicketOrdersDto);

    commitOffsets(context);
  }
}
