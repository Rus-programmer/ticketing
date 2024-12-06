import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { ISessionData } from '@my-rus-package/ticketing';

@Injectable()
export class SessionService {
  assign(request: Request, { accessToken, refreshToken }: ISessionData) {
    request.session.tokens = {
      accessToken,
      refreshToken,
    };
    request.session.userAgent = request['user-agent'];
  }

  remove(session: SessionData) {
    session.tokens = null;
    session.userAgent = null;
  }
}
