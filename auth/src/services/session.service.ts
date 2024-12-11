import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ISessionData, ITokens } from '@my-rus-package/ticketing';

@Injectable()
export class SessionService {
  assign(request: Request, { accessToken, refreshToken }: ITokens) {
    request.session.tokens = {
      accessToken,
      refreshToken,
    };
    request.session.userAgent = request.headers['user-agent'];
  }

  remove(session: ISessionData) {
    session.tokens = null;
    session.userAgent = null;
  }
}
