import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@my-rus-package/ticketing';

export class CancelOrderPaymentsDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  id: number;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expiresAt: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId: number;
}
