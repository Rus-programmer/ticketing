import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserService } from '../services/create-user.service';
import {
  KafkaTopicsService,
  User,
  UtilsModule,
} from '@my-rus-package/ticketing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { USERS_SERVICE } from '../constants/kafka.constants';
import { GetUserService } from '../services/get-user.service';
import kafkaConfig from '../config/kafka.config';

@Module({
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        ...kafkaConfig,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserService,
    GetUserService,
    KafkaTopicsService,
  ],
})
export class UsersModule {}
