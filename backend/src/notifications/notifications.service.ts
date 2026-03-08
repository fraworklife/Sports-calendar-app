import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SportsService } from '../sports/sports.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private sportsService: SportsService,
  ) {}

  // ─────────────────────────────────────────────────────────
  //  Cron ogni minuto: controlla eventi imminenti
  // ─────────────────────────────────────────────────────────
  @Cron(CronExpression.EVERY_MINUTE)
  async checkUpcomingEvents() {
    const now = new Date();

    // 1) Notifica 30 minuti prima
    const in30min = new Date(now.getTime() + 30 * 60 * 1000);
    const in31min = new Date(now.getTime() + 31 * 60 * 1000);

    const upcomingIn30 = await this.prisma.userEvent.findMany({
      where: {
        notified30: false,
        event: {
          startDate: { gte: in30min, lte: in31min },
        },
      },
      include: { user: true, event: true },
    });

    for (const ue of upcomingIn30) {
      await this.sendNotification(
        ue.user.email,
        ue.user.name,
        ue.event.title,
        '30 minuti',
        ue.event.startDate,
      );
      await this.prisma.userEvent.update({
        where: { id: ue.id },
        data: { notified30: true },
      });
    }

    // 2) Notifica all'inizio evento
    const justStarted = await this.prisma.userEvent.findMany({
      where: {
        notifiedStart: false,
        event: {
          startDate: { gte: now, lte: new Date(now.getTime() + 60 * 1000) },
        },
      },
      include: { user: true, event: true },
    });

    for (const ue of justStarted) {
      await this.sendStartNotification(
        ue.user.email,
        ue.user.name,
        ue.event.title,
      );
      await this.prisma.userEvent.update({
        where: { id: ue.id },
        data: { notifiedStart: true },
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  //  Sync API sportive ogni giorno alle 06:00
  // ─────────────────────────────────────────────────────────
  @Cron('0 6 * * *')
  async syncSportsData() {
    this.logger.log('Avvio sincronizzazione quotidiana eventi sportivi...');
    await this.sportsService.syncAll();
  }

  private sendNotification(
    email: string,
    name: string,
    eventTitle: string,
    timeLeft: string,
    startDate: Date,
  ) {
    // TODO: Integra Nodemailer o Resend per email reali
    this.logger.log(
      `📬 PREAVVISO [${email}] "${eventTitle}" inizia tra ${timeLeft} (${startDate.toLocaleTimeString('it-IT')})`,
    );
  }

  private sendStartNotification(email: string, name: string, eventTitle: string) {
    // TODO: Integra Nodemailer o Resend per email reali
    this.logger.log(
      `🚨 INIZIO EVENTO [${email}] "${eventTitle}" è iniziato adesso!`,
    );
  }
}
