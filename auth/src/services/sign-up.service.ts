import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { TokenGeneratorService } from './token-generator.service';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
  LoggerService,
  SignUpDto,
  User,
} from '@my-rus-package/ticketing';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignUpService implements OnModuleInit {
  constructor(
    private tokenGeneratorService: TokenGeneratorService,
    @Inject(AUTH_SERVICE) private client: ClientKafka,
    private logger: LoggerService,
  ) {
    logger.setContext('SignUpService');
  }

  onModuleInit() {
    this.logger.log('Subscribing to ' + CREATE_USER);
    this.client.subscribeToResponseOf(CREATE_USER);
  }

  async signUp(signUpDto: SignUpDto) {
    let createdUser: User;
    try {
      this.logger.log('Sending to kafka ' + CREATE_USER);
      createdUser = await firstValueFrom(
        this.client.send<User, string>(CREATE_USER, JSON.stringify(signUpDto)),
      );
      this.logger.log('Received ' + JSON.stringify(createdUser));
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
