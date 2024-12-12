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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from '../constants/kafka.constants';
import { GetUserService } from '../services/get-user.service';

@Module({
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users',
            brokers: ['kafka-srv:9092'],
          },
          consumer: {
            groupId: 'users-consumer',
          },
        },
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
