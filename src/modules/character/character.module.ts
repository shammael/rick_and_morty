import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';

@Module({
  controllers: [CharacterController],
})
export class CharacterModule {}
