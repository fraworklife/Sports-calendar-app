import { IsEnum, IsOptional } from 'class-validator';
import { Sport } from '@prisma/client';

export class FilterEventsDto {
  @IsOptional()
  @IsEnum(Sport)
  sport?: Sport;

  @IsOptional()
  from?: string;

  @IsOptional()
  to?: string;
}
