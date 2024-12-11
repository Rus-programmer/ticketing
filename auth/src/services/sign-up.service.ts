import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { TokenGeneratorService } from './token-generator.service';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import { CREATE_USER, User } from '@my-rus-package/ticketing';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignUpService implements OnModuleInit {
  constructor(
    private tokenGeneratorService: TokenGeneratorService,
    @Inject(AUTH_SERVICE) private client: ClientKafka,
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf(CREATE_USER);
  }

  async signUp(signUpDto: SignUpDto) {
    let createdUser: User;
    try {
      createdUser = await firstValueFrom(
        this.client.send<User, string>(CREATE_USER, JSON.stringify(signUpDto)),
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    const payload = { id: createdUser.id };
    const { accessToken, refreshToken } =
      this.tokenGeneratorService.generateTokens(payload);

    return {
      accessToken,
      refreshToken,
      user: createdUser,
    };
  }
}
