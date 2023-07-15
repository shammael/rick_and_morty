import { Body, Controller, Post } from '@nestjs/common/decorators';
import { CreateEpisodeRequestDto } from './dtos/requests/create_episode.request.dto';
import { EpisodeService } from './episode.service';

@Controller('episode')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}
  @Post()
  async create(@Body() input: CreateEpisodeRequestDto) {
    return this.episodeService.create(input);
  }
}
