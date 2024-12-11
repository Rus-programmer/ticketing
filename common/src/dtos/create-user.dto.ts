import { OmitType } from '@nestjs/mapped-types';
import { SignUpDto } from './sign-up.dto';

export class CreateUserDto extends OmitType(SignUpDto, [
  'confirmPassword',
] as const) {}
