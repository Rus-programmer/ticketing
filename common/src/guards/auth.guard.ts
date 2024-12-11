import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import 'express-session';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { AuthType } from '../enums/auth.type.enum';
import { ConfigService } from '@nestjs/config';
import { ISessionData } from '../interfaces/session.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const auth = this.reflector.getAllAndOverride<AuthType>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (auth === AuthType.None) {
      return true;
    }

    const tokenType = auth ?? 'accessToken';
    const tokenSecret =
      tokenType === AuthType.RefreshToken
        ? this.configService.get('jwt.refreshTokenSecret')
        : this.configService.get('jwt.accessTokenSecret');
    const request = context.switchToHttp().getRequest();
    const token = request.session.tokens?.[tokenType];
    const isUserAgentTrusted =
      request['user-agent'] === request.session.userAgent;

    if (!token || !isUserAgentTrusted) {
      throw new UnauthorizedException();
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: tokenSecret,
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

declare module 'express-session' {
  interface SessionData {
    tokens: ISessionData;
    userAgent: string;
  }
}
