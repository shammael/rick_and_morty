import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { AssignEpisodeMiddleware } from './middlewares';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AssignEpisodeMiddleware).forRoutes('character/assign/:id');
  }
}
