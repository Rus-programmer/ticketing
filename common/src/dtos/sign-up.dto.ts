import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { IsEqualToConstraint } from '../validators/is-equal-to.contraint';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @ValidateIf((o) => o.password)
  @Validate(IsEqualToConstraint, ['password'])
  confirmPassword: string;
}
