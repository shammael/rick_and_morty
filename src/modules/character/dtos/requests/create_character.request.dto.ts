import { CharacterGender, CharacterStatus, Specy } from '@prisma/client';
import { IsString, IsEnum, IsUrl } from 'class-validator';

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
  @IsUrl()
  image: string;
}
