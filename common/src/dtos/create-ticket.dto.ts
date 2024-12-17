import { IsDecimal, IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @IsNotEmpty()
  @IsPositive()
  @IsDecimal({
    decimal_digits: '0,2',
  })
  price: number;
}
