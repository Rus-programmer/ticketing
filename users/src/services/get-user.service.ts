import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@my-rus-package/ticketing';

@Injectable()
export class GetUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string) {
    let user: User;
    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
