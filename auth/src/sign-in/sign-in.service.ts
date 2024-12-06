import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { GetUserService } from '../user/get-user/get-user.service';
import { TokenGeneratorService } from '../services/token-generator.service';

@Injectable()
export class SignInService {
  constructor(
    private getUserService: GetUserService,
    private tokenGeneratorService: TokenGeneratorService,
  ) {}

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
