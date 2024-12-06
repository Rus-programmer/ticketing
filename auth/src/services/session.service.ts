import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ISessionData } from '../shared/interfaces/session.interface';
import { SessionData } from 'express-session';

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
