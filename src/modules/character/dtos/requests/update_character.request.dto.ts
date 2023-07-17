import { CharacterGender, CharacterStatus, Specy } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCharacterRequestDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsEnum(CharacterStatus)
  @IsOptional()
  status: CharacterStatus;
  @IsEnum(Specy)
  @IsOptional()
  specy: Specy;
  @IsEnum(CharacterGender)
  @IsOptional()
  gender: CharacterGender;
}
