import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { SportsModule } from '../sports/sports.module';

@Module({
  imports: [ScheduleModule, SportsModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
