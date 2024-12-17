import { CreateTicketDto } from './create-ticket.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
