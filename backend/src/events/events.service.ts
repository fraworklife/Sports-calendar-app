import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterEventsDto } from './dto/filter-events.dto';
import { Sport } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FilterEventsDto, userId?: string) {
    const where: { sport?: Sport; startDate?: { gte?: Date; lte?: Date } } = {};

    if (filters.sport) where.sport = filters.sport;
    if (filters.from || filters.to) {
      where.startDate = {};
      if (filters.from) where.startDate.gte = new Date(filters.from);
      if (filters.to) where.startDate.lte = new Date(filters.to);
    }

    const events = await this.prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
      include: userId
        ? {
            users: {
              where: { userId },
              select: { id: true },
            },
          }
        : undefined,
    });

    return events.map((e) => ({
      ...e,
      isSubscribed: userId ? (e.users?.length ?? 0) > 0 : false,
      users: undefined,
    }));
  }

  async findOne(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: userId
        ? {
            users: {
              where: { userId },
              select: { id: true },
            },
          }
        : undefined,
    });
    if (!event) return null;
    return {
      ...event,
      isSubscribed: userId ? (event.users?.length ?? 0) > 0 : false,
      users: undefined,
    };
  }

  async subscribe(eventId: string, userId: string) {
    return this.prisma.userEvent.upsert({
      where: { userId_eventId: { userId, eventId } },
      create: { userId, eventId },
      update: {},
    });
  }

  async unsubscribe(eventId: string, userId: string) {
    return this.prisma.userEvent.deleteMany({
      where: { userId, eventId },
    });
  }

  async getUserEvents(userId: string) {
    return this.prisma.userEvent.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: {
        event: { startDate: 'asc' },
      },
    });
  }
}
