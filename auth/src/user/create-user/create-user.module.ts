import { Module } from '@nestjs/common';
import { CreateUserController } from './create-user.controller';
import { CreateUserService } from './create-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@my-rus-package/ticketing';

@Module({
  controllers: [CreateUserController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CreateUserService],
  exports: [CreateUserService],
})
export class CreateUserModule {}
