import {
  CharacterGender,
  CharacterState,
  CharacterStatus,
  Specy,
} from '@prisma/client';
import { IsString, IsEnum, IsArray } from 'class-validator';

export class CreateCharacterRequestDto {
  @IsString()
  name: string;
  @IsEnum(CharacterStatus)
  status: CharacterStatus;
  @IsEnum(Specy)
  specy: Specy;
  @IsEnum(CharacterGender)
  gender: CharacterGender;
  @IsString()
  image: string;
  @IsString()
  created: string;
  @IsArray()
  episodeIDs: string[];
}
