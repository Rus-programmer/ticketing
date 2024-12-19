import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class CreateTicketOrdersDto extends CreateTicketDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;
}
