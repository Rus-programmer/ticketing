import { PickType } from '@nestjs/mapped-types';
import { SignUpDto } from './sign-up.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto extends PickType(SignUpDto, ['email'] as const) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
