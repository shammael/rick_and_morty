import { IsString } from 'class-validator';

export class CreateEpisodeRequestDto {
  @IsString()
  name: string;
  @IsString()
  url: string;
  @IsString()
  code: string;
}
