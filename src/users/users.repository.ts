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

  async create(data: usersEntity): Promise<usersEntity> {
    try {
      const users = this.usersRepository.create(data);
      return await this.usersRepository.save(users);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to save user');
    }
  }

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

  async update(id: number, user: UserDetailDto): Promise<usersEntity> {
    try {
      // Update
      const result = await this.usersRepository.update(
        { id: id },
        {
          ...(user.username && { user_name: user.username }),
          ...(user.status && { status: user.status }),
          ...(user.nickname && { nickname: user.nickname }),
          updated_at: new Date(),
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

  async deleteUserById(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
