import { CharacterGender, CharacterStatus, Specy } from '@prisma/client';
import { IsArray, IsEnum, IsString } from 'class-validator';

export class UpdateCharacterRequestDto {
  @IsString()
  name: string;
  @IsEnum(CharacterStatus)
  status: CharacterStatus;
  @IsEnum(Specy)
  specy: Specy;
  @IsEnum(CharacterGender)
  gender: CharacterGender;
  @IsArray()
  episodeIDs: string[];
}
