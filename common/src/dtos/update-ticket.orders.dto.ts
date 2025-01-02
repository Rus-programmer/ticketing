import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketOrdersDto } from './create-ticket.orders.dto';

export class UpdateTicketOrdersDto extends PartialType(CreateTicketOrdersDto) {}
