import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class SessionService {
  assign(request: Request, response: Response, { accessToken, refreshToken }) {
    response.cookie('accessToken', accessToken, { httpOnly: true });
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    response.cookie('userAgent', request.headers['user-agent'], {
      httpOnly: true,
    });
  }

  remove(response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    response.clearCookie('userAgent');
  }
}
