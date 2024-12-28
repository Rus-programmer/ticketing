import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentCreatedDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  stripeId: string;
}
