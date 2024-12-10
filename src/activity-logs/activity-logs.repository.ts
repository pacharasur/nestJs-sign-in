import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { activityLogsEntity } from './entities/activity-logs.entity';

@Injectable()
export class ActivityLogsRepository {
  private readonly logger = new Logger(ActivityLogsRepository.name);
  constructor(
    @InjectRepository(activityLogsEntity)
    private activityLogsRepository: Repository<activityLogsEntity>,
  ) { }

  async create(data: activityLogsEntity): Promise<activityLogsEntity> {
    try {
      const users = this.activityLogsRepository.create(data);
      return await this.activityLogsRepository.save(users);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create activity logs');
    }
  }
}
