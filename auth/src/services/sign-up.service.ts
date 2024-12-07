import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { TokenGeneratorService } from './token-generator.service';

@Injectable()
export class SignUpService {
  constructor(
    private createUserService: CreateUserService,
    private tokenGeneratorService: TokenGeneratorService,
  ) {}

  async signUp(createUserDto: SignUpDto) {
    const createdUser = await this.createUserService.create(createUserDto);

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
