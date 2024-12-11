import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TokenGeneratorService } from './token-generator.service';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import { CREATE_USER, SignInDto, User } from '@my-rus-package/ticketing';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignInService {
  constructor(
    private tokenGeneratorService: TokenGeneratorService,
    @Inject(AUTH_SERVICE) private client: ClientKafka,
  ) {}

  async signIn(updateUserDto: SignInDto) {
    let user: User;
    try {
      user = await firstValueFrom(
        this.client.send<User, string>(CREATE_USER, updateUserDto.email),
      );
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
