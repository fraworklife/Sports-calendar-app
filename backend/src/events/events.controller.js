import {
  Controller,
  Get,
  Post,
  Delete,
  Inject,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  /**
   * @param {EventsService} eventsService
   */
  constructor(@Inject(EventsService) eventsService) {
    this.eventsService = eventsService;
  }

  // Public — list all events (with subscription info if authenticated)
  @Get()
  /**
   * @param {import('./dto/filter-events.dto').FilterEventsDto} filters
   */
  findAll(@Query() filters, @Request() req) {
    return this.eventsService.findAll(filters, req.user?.id);
  }

  // Public — get single event
  @Get(':id')
  findOne(@Param('id') id, @Request() req) {
    return this.eventsService.findOne(id, req.user?.id);
  }

  // Protected — subscribe to event
  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  subscribe(@Param('id') eventId, @Request() req) {
    return this.eventsService.subscribe(eventId, req.user.id);
  }

  // Protected — unsubscribe from event
  @UseGuards(JwtAuthGuard)
  @Delete(':id/unsubscribe')
  unsubscribe(@Param('id') eventId, @Request() req) {
    return this.eventsService.unsubscribe(eventId, req.user.id);
  }

  // Protected — get current user's subscribed events
  @UseGuards(JwtAuthGuard)
  @Get('user/my-events')
  getMyEvents(@Request() req) {
    return this.eventsService.getUserEvents(req.user.id);
  }
}
