import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GET_USER_BY_ID,
  ICookiesData,
  IPayload,
  LoggerService,
  User,
} from '@my-rus-package/ticketing';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class CurrentUserService {
  constructor(
    private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(AUTH_SERVICE) private client: ClientKafka,
    private logger: LoggerService,
  ) {
    logger.setContext('CurrentUserService');
  }

  async getCurrentUser(cookies: ICookiesData) {
    let payload: IPayload;
    try {
      const token = cookies.accessToken;
      this.logger.log('Verifying token');
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.accessTokenSecret'),
      });
      this.logger.log('Payload ' + JSON.stringify(payload));
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    let user: User;
    try {
      this.logger.log('Sending to kafka ' + GET_USER_BY_ID);
      user = await firstValueFrom(
        this.client.send<User, number>(GET_USER_BY_ID, payload.id),
      );
      this.logger.log('Received ' + JSON.stringify(user));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return user;
  }
}
