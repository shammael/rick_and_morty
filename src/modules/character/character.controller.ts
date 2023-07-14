import { Body, Controller, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterRequestDto } from './dtos';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}
  @Post()
  create(@Body() input: CreateCharacterRequestDto) {
    return this.characterService.create(input);
  }
}
