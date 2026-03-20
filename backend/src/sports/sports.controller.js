import { Controller, Post, Inject, UseGuards } from '@nestjs/common';
import { SportsService } from './sports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sports')
export class SportsController {
  /**
   * @param {SportsService} sportsService
   */
  constructor(@Inject(SportsService) sportsService) {
    this.sportsService = sportsService;
  }

  // Manual trigger for sync (admin use)
  @UseGuards(JwtAuthGuard)
  @Post('sync')
  syncAll() {
    return this.sportsService.syncAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync/f1')
  syncF1() {
    return this.sportsService.syncF1Events();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync/football')
  syncFootball() {
    return this.sportsService.syncFootballEvents();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync/nba')
  syncNba() {
    return this.sportsService.syncNbaEvents();
  }
}
