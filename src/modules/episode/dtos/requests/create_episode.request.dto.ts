import { IsString, IsUrl } from 'class-validator';

export class CreateEpisodeRequestDto {
  @IsString()
  name: string;
  @IsString()
  @IsUrl()
  url: string;
  @IsString()
  code: string;
}
