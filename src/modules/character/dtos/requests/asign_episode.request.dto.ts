import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class EpisodeDataDto {
  @IsString()
  code: string;
  locations: Location[];
}

export class AsignEpisodesRequestDto {
  episodes_data: EpisodeDataDto[];
}

class Location {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  from: string;
  @IsDate()
  @Transform(({ value }) => new Date(value))
  to: string;
}
