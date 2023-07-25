import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common/decorators';
import {
  DeleteEpisodeRequestDto,
  GetAllEpisodeParams,
  GetOneRequestDto,
  SuspendEpisodeDto,
} from './dtos';
import { CreateEpisodeRequestDto } from './dtos/requests/create_episode.request.dto';
import { EpisodeService } from './episode.service';

@Controller('episode')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}
  @Post()
  async create(@Body() input: CreateEpisodeRequestDto) {
    return this.episodeService.create(input);
  }

  @Patch(':id')
  async suspend(@Param() input: SuspendEpisodeDto) {
    return this.episodeService.suspend(input.id);
  }

  @Get()
  async getAll(@Query() input: GetAllEpisodeParams) {
    return this.episodeService.getAll({
      limit: parseInt(input.limit),
      page: parseInt(input.page),
      type: input.filter_type,
      value: input.filter_value,
    });
  }

  @Get(':id')
  async GetOne(@Param() input: GetOneRequestDto) {
    return this.episodeService.getOne(input.id);
  }

  @Delete(':id')
  async deleteOne(@Param() input: DeleteEpisodeRequestDto) {
    return this.episodeService.delete(input.id);
  }

  @Delete('character_episode/:id')
  async deleteCharacterEpisode(@Param() input: DeleteEpisodeRequestDto) {
    return this.episodeService.deleteCharacterEpisode(input.id);
  }
}
