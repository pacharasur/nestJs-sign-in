import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import dataSource from 'src/database/typeorm.config';
import { usersEntity } from './entities/users.entity';
import { UserDetailDto, UserDto } from './dto/user-data.dto';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(usersEntity)
    private usersRepository: Repository<usersEntity>,
  ) { }

  /**
   * @description This function creates a new application
   * @param data the data to be used in creating the new application
   * @returns the newly created application
   */
  async create(data: usersEntity): Promise<usersEntity> {
    try {
      const users = this.usersRepository.create(data);
      return await this.usersRepository.save(users);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to save user');
    }
  }

  /**
   * @description Find a single application by its contract code.
   * @param username The contract code of the application to find.
   * @returns The usersEntity entity if it exists, or null if it does not exist.
   */
  async getUserByUserName(username: string): Promise<usersEntity> {
    try {
      return await this.usersRepository.findOne({
        where: {
          user_name: username,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Failed to find user by username',
      );
    }
  }

  async getUserById(id: number): Promise<usersEntity> {
    try {
      return await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Failed to find user by ID',
      );
    }
  }

  async update(id: number, user: UserDetailDto): Promise<any> {
    try {
      // Update
      const result = await this.usersRepository.update(
        { id: id },
        {
          ...(user.username && { user_name: user.username }),
          ...(user.status && { status: user.status }),
          ...(user.nickname && { nickname: user.nickname }),
        }
      );
      return await this.usersRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      this.logger.error(`Failed to update user ${error}`)
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
