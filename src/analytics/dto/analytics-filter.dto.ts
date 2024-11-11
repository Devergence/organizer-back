import { IsEnum, IsOptional } from 'class-validator';

export enum TimePeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class AnalyticsFilterDto {
  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;

  @IsOptional()
  category?: string;

  @IsOptional()
  importance?: string;
}
