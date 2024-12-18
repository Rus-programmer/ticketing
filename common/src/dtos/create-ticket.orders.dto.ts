import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class CreateTicketOrdersDto extends CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
