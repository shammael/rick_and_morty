import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EpisodeModule } from './modules/episode/episode.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule, EpisodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
