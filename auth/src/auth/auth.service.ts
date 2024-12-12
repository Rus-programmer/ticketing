import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpService } from '../services/sign-up.service';
import { SignInService } from '../services/sign-in.service';
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
  IPayload,
  ISessionData,
  SignInDto,
  SignUpDto,
} from '@my-rus-package/ticketing';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenGeneratorService } from '../services/token-generator.service';
import { Request } from 'express';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(AUTH_SERVICE) private client: ClientKafka,
    @Inject(ConfigService) private configService: ConfigService,
    private signUpService: SignUpService,
    private signInService: SignInService,
    private jwtService: JwtService,
    private tokenGeneratorService: TokenGeneratorService,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf(CREATE_USER);
    this.client.subscribeToResponseOf(GET_USER_BY_EMAIL);
    this.client.subscribeToResponseOf(GET_USER_BY_ID);
  }

  async signUp(createUserDto: SignUpDto) {
    return this.signUpService.signUp(createUserDto);
  }

  async signIn(updateUserDto: SignInDto) {
    return this.signInService.signIn(updateUserDto);
  }

  refreshAccessToken(request: Request) {
    const session = request.session as ISessionData;
    const oldRefreshToken = session.tokens.refreshToken;

    if (session.userAgent !== request.headers['user-agent']) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let payload: IPayload;
    try {
      payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get('jwt.refreshTokenSecret'),
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const { accessToken, refreshToken } =
      this.tokenGeneratorService.generateTokens({ id: payload.id });

    return {
      accessToken,
      refreshToken,
    };
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
