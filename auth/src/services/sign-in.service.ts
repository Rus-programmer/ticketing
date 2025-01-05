import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TokenGeneratorService } from './token-generator.service';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import {
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
  LoggerService,
  SignInDto,
  User,
} from '@my-rus-package/ticketing';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignInService {
  constructor(
    private tokenGeneratorService: TokenGeneratorService,
    @Inject(AUTH_SERVICE) private client: ClientKafka,
    private logger: LoggerService,
  ) {
    logger.setContext('SignInService');
  }

  async signIn(signInDto: SignInDto) {
    let user: User;
    try {
      this.logger.log('Sending to kafka ' + GET_USER_BY_EMAIL);
      user = await firstValueFrom(
        this.client.send<User, string>(GET_USER_BY_EMAIL, signInDto.email),
      );
      this.logger.log('Received ' + JSON.stringify(user));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    const payload = { id: user.id };
    const { accessToken, refreshToken } =
      this.tokenGeneratorService.generateTokens(payload);

    return {
      accessToken,
      refreshToken,
      user: user,
    };
  }
}
