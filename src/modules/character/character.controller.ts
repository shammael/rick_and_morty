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
import { CreateCharacterRequestDto, UpdateCharacterRequestDto } from './dtos';
import { GetAllParamsDtos } from './dtos/requests/get_all.request.dto';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}
  @Post()
  create(@Body() input: CreateCharacterRequestDto) {
    return this.characterService.create(input);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.characterService.delete(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() request: UpdateCharacterRequestDto) {
    return this.characterService.update(id, request);
  }

  @Patch('assign/:id')
  asignEpisode(@Param('id') id: string, @Body() input: string[]) {
    return this.characterService.asignEpisodes(id, input);
  }

  @Get()
  getAll(@Query() input: GetAllParamsDtos) {
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

    return this.characterService.getAll({
      ...filter,
      limit: parseInt(input.limit),
      page: parseInt(input.page),
    });
  }
}
