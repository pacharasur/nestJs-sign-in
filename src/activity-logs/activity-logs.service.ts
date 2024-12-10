import { Injectable, Logger } from '@nestjs/common';
import { ActivityLogsRepository } from './activity-logs.repository';
import { populateToActivityEntity, populateToActivityResponse } from 'src/util/tools';
import { IActivityResponse } from './interfaces/user.interface';
import { activityLogsEntity } from './entities/activity-logs.entity';

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);
  constructor(
    private readonly activityLogsRepository: ActivityLogsRepository,
  ) { }

  async createActivityLog(username: string, actualUsername: string, method: string, url: string, code: string, status: number, description: string): Promise<IActivityResponse> {
    try {
      const actEntity = populateToActivityEntity(username, actualUsername, method, url, code, status, description);
      const result = await this.activityLogsRepository.create(actEntity);
      return populateToActivityResponse(result);
    } catch (err) {
      this.logger.error(`cannot activity log ${err}`);
      throw err;
    }
  }
}
