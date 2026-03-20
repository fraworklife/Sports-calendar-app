import { IsIn, IsOptional } from 'class-validator';

const SPORT_VALUES = ['F1', 'FOOTBALL', 'NBA'];

export class FilterEventsDto {
  /** @type {'F1' | 'FOOTBALL' | 'NBA' | undefined} */
  @IsOptional()
  @IsIn(SPORT_VALUES)
  sport;

  /** @type {string | undefined} */
  @IsOptional()
  from;

  /** @type {string | undefined} */
  @IsOptional()
  to;
}
