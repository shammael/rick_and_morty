import { IsString } from 'class-validator';

export class SuspendEpisodeDto {
  @IsString()
  id: string;
}
