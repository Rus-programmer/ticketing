import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SignUpService } from '../services/sign-up.service';
import { SignInService } from '../services/sign-in.service';
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
  SignInDto,
  SignUpDto,
} from '@my-rus-package/ticketing';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(AUTH_SERVICE) private client: ClientKafka,
    private signUpService: SignUpService,
    private signInService: SignInService,
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf(CREATE_USER);
    this.client.subscribeToResponseOf(GET_USER_BY_EMAIL);
  }

  async signUp(createUserDto: SignUpDto) {
    return this.signUpService.signUp(createUserDto);
  }

  async signIn(updateUserDto: SignInDto) {
    return this.signInService.signIn(updateUserDto);
  }
}
