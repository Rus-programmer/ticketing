import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@my-rus-package/ticketing';

@Injectable()
export class TokenGeneratorService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    logger.setContext('TokenGeneratorService');
  }

  private generator(payload: Buffer | object, options?: JwtSignOptions) {
    try {
      return this.jwtService.sign(payload, options);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  public generateAccessToken(payload: Buffer | object) {
    this.logger.log('Generating access token');
    return this.generator(payload);
  }

  public generateRefreshToken(payload: Buffer | object) {
    this.logger.log('Generating refresh token');
    return this.generator(payload, {
      secret: this.configService.get('jwt.refreshTokenSecret'),
      expiresIn: this.configService.get('jwt.refreshTokenTtl'),
    });
  }

  public generateTokens(payload: Buffer | object) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
