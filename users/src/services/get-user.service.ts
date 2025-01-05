import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService, User } from '@my-rus-package/ticketing';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class GetUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly logger: LoggerService,
  ) {
    logger.setContext('GetUserService');
  }

  async getUsers(limit: number, offset: number = 0): Promise<User[]> {
    let users: User[];
    try {
      this.logger.log(
        'Finding users. Limit = ' + limit + ' offset = ' + offset,
      );
      users = await this.userRepository.find({
        skip: offset,
        ...(!limit ? {} : { take: limit }),
      });
      this.logger.log('Found correctly');
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return users;
  }

  async getUserByEmail(email: string) {
    return await this.findOneBy({ email });
  }

  async getUserById(id: string) {
    return await this.findOneBy({ id });
  }

  async findOneBy<T>(option: FindOptionsWhere<T>): Promise<User> {
    let user: User;
    try {
      this.logger.log('Finding user by options = ' + JSON.stringify(option));
      user = await this.userRepository.findOneBy(option);
      this.logger.log('Result ' + JSON.stringify({ userId: user.id }));
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
