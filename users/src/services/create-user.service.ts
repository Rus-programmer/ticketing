import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignUpDto } from '../../../auth/src/dtos/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService, User } from '@my-rus-package/ticketing';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(HashingService) private readonly hashingService: HashingService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: SignUpDto) {
    let existingUser: User;
    try {
      existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      const hashedPassword = await this.hashingService.hashPassword(
        createUserDto.password,
      );
      let newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      newUser = await this.userRepository.save(newUser);
      return newUser;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
