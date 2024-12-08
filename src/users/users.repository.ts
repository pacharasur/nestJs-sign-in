import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import dataSource from 'src/database/typeorm.config';
import { usersEntity } from './entities/users.entity';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(usersEntity)
    private usersRepository: Repository<usersEntity>,
  ) {}

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
  async findByUserName(username: string): Promise<usersEntity> {
    try {
      return await this.usersRepository.findOne({
        where: {
          user_name: username,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to find user by username',
      );
    }
  }

  /**
   * @description Find a single application by its contract number.
   * @param contractNumber The contract number of the application to find.
   * @returns The application entity if it exists, or null if it does not exist.
   */
  async findByContractNumber(
    contractNumber: string,
  ): Promise<usersEntity> {
    try {
      return await this.usersRepository.findOne({
        where: {
          password: contractNumber,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to find application by contract number',
      );
    }
  }

  /**
   * @description This function is get application in this day
   * @return the data for every application in this day
   */
  async getApplicationThisDay(): Promise<usersEntity[]> {
    this.logger.log('GET APPLICATION THIS DAY');
    const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เวลาเริ่มต้นวัน
    const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // เวลาสิ้นสุดวัน
    this.logger.log(`BETWEEN ${startDate} and ${endDate}`);
    return dataSource.manager
      .createQueryBuilder(usersEntity, 'app')
      .select('app.*')
      .where('app.created_at BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      })
      .getRawMany();
  }
}
