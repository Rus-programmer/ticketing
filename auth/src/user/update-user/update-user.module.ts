import { Module } from '@nestjs/common';
import { UpdateUserService } from './update-user.service';
import { UpdateUserController } from './update-user.controller';

@Module({
  providers: [UpdateUserService],
  controllers: [UpdateUserController]
})
export class UpdateUserModule {}
