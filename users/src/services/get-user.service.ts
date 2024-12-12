import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@my-rus-package/ticketing';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class GetUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(limit: number, offset: number = 0): Promise<User[]> {
    let users: User[];
    try {
      users = await this.userRepository.find({
        skip: offset,
        ...(!limit ? {} : { take: limit }),
      });
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
      user = await this.userRepository.findOneBy(option);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
