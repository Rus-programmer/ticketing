import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto extends PickType(CreateUserDto, ['email'] as const) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
