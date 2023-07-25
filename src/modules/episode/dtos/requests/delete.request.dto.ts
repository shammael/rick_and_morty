import { IsString } from 'class-validator';

export class DeleteEpisodeRequestDto {
  @IsString()
  id: string;
}
