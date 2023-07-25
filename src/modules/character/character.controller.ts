import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CharacterState, CharacterStatus, Specy } from '@prisma/client';

import { CharacterService, Filter } from './character.service';
import {
  CharacterResponseDto,
  CreateCharacterRequestDto,
  UpdateCharacterRequestDto,
} from './dtos';
import { AsignEpisodesRequestDto } from './dtos/requests/asign_episode.request.dto';
import { GetAllParamsDtos } from './dtos/requests/get_all.request.dto';
import { Serialize } from './interceptors';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}
  @Post()
  @Serialize(CharacterResponseDto)
  create(@Body() input: CreateCharacterRequestDto) {
    return this.characterService.create(input);
  }

  @Delete(':id')
  @Serialize(CharacterResponseDto)
  delete(@Param('id') id: string) {
    return this.characterService.delete(id);
  }

  @Patch(':id')
  @Serialize(CharacterResponseDto)
  update(@Param('id') id: string, @Body() request: UpdateCharacterRequestDto) {
    return this.characterService.update(id, request);
  }

  @Patch('assign/:id')
  // @UseGuards(AssignEpisodeGuard)
  asignEpisode(
    @Param('id') id: string,
    @Body() input: AsignEpisodesRequestDto,
  ) {
    return this.characterService.asignEpisodes(id, input);
  }

  @Get()
  // @Serialize(CharactersResponseDto)
  async getAll(@Query() input: GetAllParamsDtos) {
    let filter: Filter;

    switch (input.filter_type) {
      case 'specy':
        filter = { type: 'specy', value: input.filter_value as Specy };
        break;
      case 'status':
        filter = {
          type: 'status',
          value: input.filter_value as CharacterStatus,
        };
        break;
      case 'state':
        filter = { type: 'state', value: input.filter_value as CharacterState };
        break;
    }

    const characters = await this.characterService.getAll({
      ...filter,
      limit: parseInt(input.limit),
      page: parseInt(input.page),
    });

    return {
      characters,
    };
  }

  @Get(':id')
  @Serialize(CharacterResponseDto)
  getOne(@Param('id') input: string) {
    return this.characterService.getOne(input);
  }
}
