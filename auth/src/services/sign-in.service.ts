import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { TokenGeneratorService } from './token-generator.service';

@Injectable()
export class SignInService {
  constructor(private tokenGeneratorService: TokenGeneratorService) {}

  async signIn(updateUserDto: SignInDto) {
    const user = await this.getUserService.getUserByEmail(updateUserDto.email);

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
