import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { activityLogsEntity } from './entities/activity-logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsRepository } from './activity-logs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      activityLogsEntity,
    ]),
  ],
  controllers: [],
  providers: [ActivityLogsService, ActivityLogsRepository],
  exports: [ActivityLogsService,]
})
export class ActivityLogsModule { }