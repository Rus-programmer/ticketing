import { Controller, Delete, Session } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { SessionData } from 'express-session';

@Controller('sign-out')
export class SignOutController {
  constructor(private sessionService: SessionService) {}

  @Delete()
  async signOut(@Session() session: SessionData) {
    return this.sessionService.remove(session);
  }
}
