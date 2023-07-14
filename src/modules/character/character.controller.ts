import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterRequestDto, UpdateCharacterRequestDto } from './dtos';

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
}
