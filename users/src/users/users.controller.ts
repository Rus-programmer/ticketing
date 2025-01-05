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
  LoggerService,
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
    private readonly logger: LoggerService,
  ) {
    logger.setContext('UsersController');
  }

  @MessagePattern(CREATE_USER)
  @UseInterceptors(ClassSerializerInterceptor)
  @RpcTransformer()
  async createUser(@Payload() createUserDto: CreateUserDto) {
    this.logger.log(
      CREATE_USER + ' kafka event received ' + JSON.stringify(createUserDto),
    );
    return await this.createUserService.create(createUserDto);
  }

  @MessagePattern(GET_USER_BY_EMAIL)
  @UseInterceptors(ClassSerializerInterceptor)
  @RpcTransformer()
  async getUserByEmail(@Payload() email: string) {
    this.logger.log(
      GET_USER_BY_EMAIL + ' kafka event received. Email = ' + email,
    );
    return await this.getUserService.getUserByEmail(email);
  }

  @MessagePattern(GET_USER_BY_ID)
  @UseInterceptors(ClassSerializerInterceptor)
  @RpcTransformer()
  async getUserById(@Payload() id: string) {
    this.logger.log(GET_USER_BY_ID + ' kafka event received. Id = ' + id);
    return await this.getUserService.getUserById(id);
  }

  @Get()
  async getUsers(@Query() { limit = 0, page = 1 }: PaginationDto) {
    this.logger.log('Getting users. Page = ' + page + ' limit = ' + limit);
    return this.getUserService.getUsers(limit, limit * (page - 1));
  }
}
