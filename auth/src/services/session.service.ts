import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '@my-rus-package/ticketing';

@Injectable()
export class SessionService {
  constructor(private logger: LoggerService) {
    logger.setContext('SessionService');
  }

  assign(request: Request, response: Response, { accessToken, refreshToken }) {
    this.logger.log('Assigning cookies');
    response.cookie('accessToken', accessToken, { httpOnly: true });
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    response.cookie('userAgent', request.headers['user-agent'], {
      httpOnly: true,
    });
  }

  remove(response: Response) {
    this.logger.log('Removing cookies');
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    response.clearCookie('userAgent');
  }
}
