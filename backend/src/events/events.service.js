import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  /**
   * @param {PrismaService} prisma
   */
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
  }

  /**
   * @param {import('./dto/filter-events.dto').FilterEventsDto} filters
   * @param {string | undefined} userId
   */
  async findAll(filters, userId) {
    const where = {};

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

    return events.map((event) => ({
      ...event,
      isSubscribed: userId ? (event.users?.length ?? 0) > 0 : false,
      users: undefined,
    }));
  }

  async findOne(id, userId) {
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

  async subscribe(eventId, userId) {
    return this.prisma.userEvent.upsert({
      where: { userId_eventId: { userId, eventId } },
      create: { userId, eventId },
      update: {},
    });
  }

  async unsubscribe(eventId, userId) {
    return this.prisma.userEvent.deleteMany({
      where: { userId, eventId },
    });
  }

  async getUserEvents(userId) {
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
