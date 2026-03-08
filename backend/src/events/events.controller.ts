import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  Optional,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { FilterEventsDto } from './dto/filter-events.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Public — list all events (with subscription info if authenticated)
  @Get()
  findAll(@Query() filters: FilterEventsDto, @Request() req: { user?: { id: string } }) {
    return this.eventsService.findAll(filters, req.user?.id);
  }

  // Public — get single event
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: { user?: { id: string } }) {
    return this.eventsService.findOne(id, req.user?.id);
  }

  // Protected — subscribe to event
  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  subscribe(@Param('id') eventId: string, @Request() req: { user: { id: string } }) {
    return this.eventsService.subscribe(eventId, req.user.id);
  }

  // Protected — unsubscribe from event
  @UseGuards(JwtAuthGuard)
  @Delete(':id/unsubscribe')
  unsubscribe(@Param('id') eventId: string, @Request() req: { user: { id: string } }) {
    return this.eventsService.unsubscribe(eventId, req.user.id);
  }

  // Protected — get current user's subscribed events
  @UseGuards(JwtAuthGuard)
  @Get('user/my-events')
  getMyEvents(@Request() req: { user: { id: string } }) {
    return this.eventsService.getUserEvents(req.user.id);
  }
}
