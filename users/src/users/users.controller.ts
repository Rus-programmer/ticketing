import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CREATE_USER } from '@my-rus-package/ticketing';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserService } from '../services/create-user.service';
import { RpcTransformer } from '../decorators/rpc-transformer.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserService: CreateUserService) {}

  @MessagePattern(CREATE_USER)
  @UseInterceptors(ClassSerializerInterceptor)
  @RpcTransformer()
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return await this.createUserService.create(createUserDto);
  }
}
