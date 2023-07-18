import {
  CharacterGender,
  CharacterState,
  CharacterStatus,
  Specy,
} from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class CharacterResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  state: CharacterState;
  @Expose()
  status: CharacterStatus;
  @Exclude()
  specy: Specy;
  @Expose()
  gender: CharacterGender;
  @Expose()
  image: string;
  @Exclude({ toPlainOnly: true })
  created: string;
}
