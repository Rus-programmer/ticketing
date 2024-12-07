import { Injectable } from '@nestjs/common';
import { SignUpService } from '../services/sign-up.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignInService } from '../services/sign-in.service';

@Injectable()
export class AuthService {
  constructor(
    private signUpService: SignUpService,
    private signInService: SignInService,
  ) {}

  async signUp(createUserDto: SignUpDto) {
    return this.signUpService.signUp(createUserDto);
  }

  async signIn(updateUserDto: SignInDto) {
    return this.signInService.signIn(updateUserDto);
  }
}
