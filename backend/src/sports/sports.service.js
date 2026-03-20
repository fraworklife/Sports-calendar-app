import { Injectable, Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SportsService {
  logger = new Logger(SportsService.name);

  /**
   * @param {PrismaService} prisma
   */
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
  }

  // ─────────────────────────────────────────────────────────
  //  FORMULA 1 — OpenF1 API (no key required)
  // ─────────────────────────────────────────────────────────
  async syncF1Events() {
    try {
      this.logger.log('Sincronizzazione eventi Formula 1...');
      const currentYear = new Date().getFullYear();
      const { data } = await axios.get(
        `https://api.openf1.org/v1/sessions?year=${currentYear}&session_type=Race`,
      );

      for (const session of data) {
        const externalId = `f1_${session.session_key}`;
        const startDate = new Date(session.date_start);
        const endDate = new Date(session.date_end);

        await this.prisma.event.upsert({
          where: { externalId },
          create: {
            externalId,
            title: `F1 – ${session.meeting_name} (${session.session_name})`,
            sport: 'F1',
            startDate,
            endDate,
            venue: session.location,
            description: `${session.country_name} Grand Prix`,
            metadata: {
              circuit: session.circuit_short_name,
              country: session.country_name,
              sessionKey: session.session_key,
            },
          },
          update: {
            startDate,
            endDate,
            title: `F1 – ${session.meeting_name} (${session.session_name})`,
          },
        });
      }
      this.logger.log(`Formula 1: sincronizzati ${data.length} eventi`);
    } catch (err) {
      this.logger.error('Errore sync F1:', err.message);
    }
  }

  // ─────────────────────────────────────────────────────────
  //  FOOTBALL — API-Football via RapidAPI
  //  Team IDs: Juventus=496, Palermo=1579
  // ─────────────────────────────────────────────────────────
  async syncFootballEvents() {
    const teams = [
      { id: 496, name: 'Juventus F.C.' },
      { id: 1579, name: 'Palermo F.C.' },
    ];

    for (const team of teams) {
      try {
        this.logger.log(`Sincronizzazione partite ${team.name}...`);
        const currentYear = new Date().getFullYear();

        const { data } = await axios.get(
          'https://api-football-v1.p.rapidapi.com/v3/fixtures',
          {
            params: { team: team.id, season: currentYear },
            headers: {
              'x-rapidapi-key': process.env.API_FOOTBALL_KEY || '',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
          },
        );

        const fixtures = data.response || [];
        for (const fix of fixtures) {
          const externalId = `football_${fix.fixture.id}`;
          const startDate = new Date(fix.fixture.date);
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

          await this.prisma.event.upsert({
            where: { externalId },
            create: {
              externalId,
              title: `${fix.teams.home.name} vs ${fix.teams.away.name}`,
              sport: 'FOOTBALL',
              startDate,
              endDate,
              venue: fix.fixture.venue?.name,
              description: `${fix.league.name} – ${fix.league.round}`,
              metadata: {
                homeTeam: fix.teams.home.name,
                awayTeam: fix.teams.away.name,
                league: fix.league.name,
                status: fix.fixture.status?.long,
              },
            },
            update: {
              startDate,
              title: `${fix.teams.home.name} vs ${fix.teams.away.name}`,
            },
          });
        }
        this.logger.log(
          `${team.name}: sincronizzate ${fixtures.length} partite`,
        );
      } catch (err) {
        this.logger.error(`Errore sync ${team.name}:`, err.message);
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  //  NBA — balldontlie.io (Lakers team_id=14)
  // ─────────────────────────────────────────────────────────
  async syncNbaEvents() {
    try {
      this.logger.log('Sincronizzazione partite NBA Lakers...');
      const currentYear = new Date().getFullYear();
      const seasons = [currentYear - 1]; // NBA season spans two years

      const { data } = await axios.get('https://api.balldontlie.io/v1/games', {
        params: {
          team_ids: [14], // LA Lakers
          seasons,
          per_page: 100,
        },
        headers: {
          Authorization: process.env.BALLDONTLIE_API_KEY || '',
        },
      });

      const games = data.data || [];
      for (const game of games) {
        const externalId = `nba_${game.id}`;
        const startDate = new Date(game.date);
        const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000);

        await this.prisma.event.upsert({
          where: { externalId },
          create: {
            externalId,
            title: `${game.home_team.full_name} vs ${game.visitor_team.full_name}`,
            sport: 'NBA',
            startDate,
            endDate,
            description: `NBA ${game.season} – ${game.status}`,
            metadata: {
              homeTeam: game.home_team.full_name,
              awayTeam: game.visitor_team.full_name,
              homeScore: game.home_team_score,
              awayScore: game.visitor_team_score,
              status: game.status,
              season: game.season,
            },
          },
          update: {
            startDate,
            title: `${game.home_team.full_name} vs ${game.visitor_team.full_name}`,
          },
        });
      }
      this.logger.log(`NBA Lakers: sincronizzate ${games.length} partite`);
    } catch (err) {
      this.logger.error('Errore sync NBA:', err.message);
    }
  }

  async syncAll() {
    await Promise.allSettled([
      this.syncF1Events(),
      this.syncFootballEvents(),
      this.syncNbaEvents(),
    ]);
  }
}
