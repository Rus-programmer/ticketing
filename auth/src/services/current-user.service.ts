import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GET_USER_BY_ID,
  IPayload,
  ISessionData,
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
  ) {}

  async getCurrentUser(session: ISessionData) {
    const token = session.tokens.accessToken;
    let payload: IPayload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.accessTokenSecret'),
      });
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    let user: User;
    try {
      user = await firstValueFrom(
        this.client.send<User, number>(GET_USER_BY_ID, payload.id),
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    return user;
  }
}
