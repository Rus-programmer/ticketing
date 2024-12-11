import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, HashingService, User } from '@my-rus-package/ticketing';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(HashingService) private readonly hashingService: HashingService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
      const binaryKey = this.configService.get('appConfig.binaryKey');
      // I used this binaryKey for simplicity. For a real use case this is not compatible
      const hashedPassword = this.hashingService.hashPassword(
        createUserDto.password,
        { key: binaryKey, iv: binaryKey.slice(0, 16) },
      ) as string;

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
