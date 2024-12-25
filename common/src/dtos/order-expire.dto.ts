import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderExpireDto {
  @IsNotEmpty()
  @Type(() => Number)
  id: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expiresAt: Date;
}
