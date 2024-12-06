import { Module } from '@nestjs/common';
import { GetUserService } from './get-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [GetUserService],
  exports: [GetUserService],
})
export class GetUserModule {}
