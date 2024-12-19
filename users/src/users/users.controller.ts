import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CREATE_USER,
  CreateUserDto,
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
  PaginationDto,
  RpcTransformer,
} from '@my-rus-package/ticketing';
import { CreateUserService } from '../services/create-user.service';
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

  @MessagePattern(GET_USER_BY_ID)
  @UseInterceptors(ClassSerializerInterceptor)
  @RpcTransformer()
  async getUserById(@Payload() id: string) {
    return await this.getUserService.getUserById(id);
  }

  @Get()
  async getUsers(@Query() { limit = 0, page = 1 }: PaginationDto) {
    return this.getUserService.getUsers(limit, limit * (page - 1));
  }
}
