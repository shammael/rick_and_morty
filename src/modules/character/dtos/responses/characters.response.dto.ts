import { Expose } from 'class-transformer';
import { CharacterResponseDto } from './character.response';

export class CharactersResponseDto {
  @Expose()
  characters: CharacterResponseDto[];
}
