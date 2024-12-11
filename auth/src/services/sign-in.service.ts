import { Inject, Injectable } from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { TokenGeneratorService } from './token-generator.service';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class SignInService {
  constructor(
    private tokenGeneratorService: TokenGeneratorService,
    @Inject(AUTH_SERVICE) private client: ClientKafka,
  ) {}

  async signIn(updateUserDto: SignInDto) {
    const user = 'await this.client.getUserByEmail(updateUserDto.email)';

    const payload = { id: 'user.id' };
    const { accessToken, refreshToken } =
      this.tokenGeneratorService.generateTokens(payload);

    return {
      accessToken,
      refreshToken,
      user: user,
    };
  }
}
