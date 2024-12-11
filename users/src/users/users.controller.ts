import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CREATE_USER,
  CreateUserDto,
  GET_USER_BY_EMAIL,
} from '@my-rus-package/ticketing';
import { CreateUserService } from '../services/create-user.service';
import { RpcTransformer } from '../decorators/rpc-transformer.decorator';
import { GetUserService } from '../services/get-user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService,
  ) {}

  @MessagePattern(CREATE_USER)
  @UseInterceptors(ClassSerializerInterceptor)
  @RpcTransformer()
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return await this.createUserService.create(createUserDto);
  }

  @MessagePattern(GET_USER_BY_EMAIL)
  @UseInterceptors(ClassSerializerInterceptor)
  @RpcTransformer()
  async getUserByEmail(@Payload() email: string) {
    return await this.getUserService.getUserByEmail(email);
  }
}
